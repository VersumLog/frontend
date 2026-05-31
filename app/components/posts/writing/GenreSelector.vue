<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string[];
  allGenres: string[];
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  // Еміт для того, щоб батьківський компонент знав, коли треба оновити список allGenres з бекенду
  (e: 'genre-created'): void; 
}>()

const config = useRuntimeConfig();
const isOpen = ref(false)
const searchQuery = ref('')
const isCreating = ref(false)
const { token, isLoggedIn } = useAuth();

// Фільтруємо доступні жанри з урахуванням пошукового запиту
const availableGenres = computed(() => {
  const available = props.allGenres.filter(g => !props.modelValue.includes(g))
  if (!searchQuery.value) return available
  
  const query = searchQuery.value.toLowerCase().trim()
  return available.filter(g => g.toLowerCase().includes(query))
})

// Перевіряємо, чи потрібно показувати кнопку створення нового жанру
const showCreateOption = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return false
  
  // Перевіряємо (без урахування регістру), чи такий жанр вже існує
  const exists = props.allGenres.some(g => g.toLowerCase() === query.toLowerCase())
  return !exists
})

const addGenre = (genre: string) => {
  if (!props.modelValue.includes(genre)) {
    emit('update:modelValue', [...props.modelValue, genre])
  }
  searchQuery.value = ''
  isOpen.value = false
}

const removeGenre = (genreToRemove: string) => {
  emit('update:modelValue', props.modelValue.filter(g => g !== genreToRemove))
}

const handleEnter = () => {
  if (showCreateOption.value) {
    createNewGenre()
  } else if (availableGenres.value.length > 0) {
    const firstGenre = availableGenres.value[0]
    const genreName = typeof firstGenre === 'function' ? (firstGenre as Function)() : firstGenre
    
    if (genreName) {
      addGenre(genreName)
    }
  }
}

const createNewGenre = async () => {
  const newGenreName = searchQuery.value.trim()
  if (!newGenreName || isCreating.value) return

  isCreating.value = true
  try {
     const baseUrl = config.public.apiBase || 'https://localhost:7014';
    // Вкажіть тут правильний шлях до вашого API
    await await $fetch<any>(`${baseUrl}/api/posts/add-genre`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token.value}` },
      body: {
        name: newGenreName // Відповідає структурі GenreCreateDto на бекенді
      }
    })
    
    // Одразу додаємо новий жанр до обраних, щоб не чекати оновлення списку
    emit('update:modelValue', [...props.modelValue, newGenreName])
    // Сповіщаємо батьківський компонент, що варто оновити загальний масив allGenres
    emit('genre-created')
    
    searchQuery.value = ''
    isOpen.value = false
  } catch (error) {
    console.error('Помилка при створенні жанру:', error)
    // Тут можна додати виклик тоста з помилкою
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 w-full">
    <div class="relative">
      <div 
        @click="isOpen = !isOpen"
        class="cursor-pointer px-4 py-1.5 rounded-full border-2 border-plum text-plum font-bold text-sm hover:bg-plum hover:text-white transition-all flex items-center gap-2 active:scale-95"
      >
        <span>Додати жанр</span>
        <Icon 
          name="lucide:plus" 
          class="w-4 h-4 transition-transform duration-200" 
          :class="{ 'rotate-45': isOpen }" 
        />
      </div>

      <transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 translate-y-1"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div 
          v-if="isOpen"
          class="absolute top-full left-0 mt-2 w-64 bg-input-bg border-2 border-cream-input rounded-xl shadow-xl z-50 flex flex-col overflow-hidden"
        >
          <div class="p-2 border-b border-cream-input bg-cream-light/50">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Пошук або створення..."
              class="w-full px-3 py-1.5 text-sm bg-white border border-cream-input rounded-lg outline-none focus:border-plum text-main transition-colors placeholder:text-muted/60"
              @keydown.enter.prevent="handleEnter"
            />
          </div>

          <div class="max-h-52 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-plum-scroll/40 [&::-webkit-scrollbar-thumb]:rounded">
            
            <div v-if="availableGenres.length === 0 && !showCreateOption" class="px-4 py-4 text-sm text-muted/70 text-center">
              {{ searchQuery ? 'Жанрів не знайдено' : 'Всі доступні жанри обрано' }}
            </div>
            
            <div 
              v-for="genre in availableGenres" 
              :key="genre" 
              @click="addGenre(genre)"
              class="px-4 py-2.5 hover:bg-cream-light cursor-pointer text-main font-medium text-sm transition-colors border-b border-cream-input last:border-0"
            >
              {{ genre }}
            </div>

            <div 
              v-if="showCreateOption"
              @click="createNewGenre"
              class="px-4 py-3 bg-plum/5 hover:bg-plum/10 cursor-pointer text-plum text-sm font-bold transition-colors border-t border-cream-input flex items-center justify-between group"
              :class="{ 'opacity-70 pointer-events-none': isCreating }"
            >
              <span>Створити "{{ searchQuery }}"</span>
              <Icon 
                v-if="isCreating" 
                name="lucide:loader-2" 
                class="w-4 h-4 animate-spin" 
              />
              <Icon 
                v-else 
                name="lucide:plus" 
                class="w-4 h-4 group-hover:scale-110 transition-transform" 
              />
            </div>

          </div>
        </div>
      </transition>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div
        v-for="genre in modelValue"
        :key="genre"
        @click="removeGenre(genre)"
        class="px-3 py-1.5 bg-cream-light border border-cream-input text-main rounded-lg text-sm font-medium cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-1.5 group shadow-sm"
      >
        <span>{{ genre }}</span>
        <Icon name="lucide:x" class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  </div>
</template>