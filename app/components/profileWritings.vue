<template>
  <div v-if="props.isAuthor" class="w-full relative font-sans">
    
    <!-- Header -->
    <div class="relative flex justify-center items-center mb-5">
      <!-- Tabs -->
      <div class="flex justify-center items-center text-lg">
        <button 
          :class="['bg-transparent border-none cursor-pointer transition-colors duration-300', activeTab === 'works' ? 'text-[#4a9588] font-semibold' : 'text-[#333]']"
          @click="activeTab = 'works'"
        >
          Твори
        </button>

        <template v-if="props.isOwner">
          <span class="mx-[15px] text-[#333]">|</span>
          <button 
            :class="['bg-transparent border-none cursor-pointer transition-colors duration-300', activeTab === 'drafts' ? 'text-[#4a9588] font-semibold' : 'text-[#333]']"
            @click="activeTab = 'drafts'"
          >
            Чернетки
          </button>
        </template>
      </div>
      
      <!-- Sort -->
      <div class="absolute right-0 top-0 bottom-0 flex items-center">
        <button class="bg-transparent border-none cursor-pointer text-base text-[#333] underline underline-offset-4" @click="isSortMenuOpen = true">
          Сортувати
        </button>

        <!-- Overlay -->
        <transition 
          enter-active-class="transition-opacity duration-300"
          leave-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="isSortMenuOpen" 
            class="fixed inset-0 w-screen h-screen bg-black/40 z-[1000] cursor-pointer" 
            @click="isSortMenuOpen = false"
          ></div>
        </transition>

        <!-- Menu -->
        <transition 
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 -translate-y-2.5 scale-95"
          leave-to-class="opacity-0 -translate-y-2.5 scale-95"
        >
          <div v-if="isSortMenuOpen" class="absolute top-full right-0 mt-1.5 bg-[#E4C1D3] border-4 border-[#2A7064] rounded-xl py-5 px-[30px] min-w-[260px] text-white shadow-2xl z-[1002]" @click.stop>
            <button
              class="absolute top-[15px] right-[15px] bg-transparent border-none cursor-pointer text-[#4A3A41] p-0 flex items-center justify-center transition-opacity hover:opacity-70"
              @click="isSortMenuOpen = false"
              title="Закрити меню"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>

            <h4 class="m-0 mb-[15px] font-medium text-xl text-[#4A3A41] pr-[25px]">Сортувати за:</h4>

            <ul class="list-none p-0 m-0">
              <li class="flex items-center gap-3 mb-3 cursor-pointer text-lg text-white font-medium transition-opacity hover:opacity-80" @click="sortBy = 'Title'">
                <span :class="['w-3.5 h-3.5 border-2 border-white rounded-full inline-block transition-colors', sortBy === 'Title' ? 'bg-white' : 'bg-transparent']"></span>
                Назвою
              </li>
              <li class="flex items-center gap-3 mb-3 cursor-pointer text-lg text-white font-medium transition-opacity hover:opacity-80" @click="sortBy = 'Description'">
                <span :class="['w-3.5 h-3.5 border-2 border-white rounded-full inline-block transition-colors', sortBy === 'Description' ? 'bg-white' : 'bg-transparent']"></span>
                Описом
              </li>
              <li class="flex items-center gap-3 mb-3 cursor-pointer text-lg text-white font-medium transition-opacity hover:opacity-80" @click="sortBy = 'CreatedAt'">
                <span :class="['w-3.5 h-3.5 border-2 border-white rounded-full inline-block transition-colors', sortBy === 'CreatedAt' ? 'bg-white' : 'bg-transparent']"></span>
                Датою
              </li>
            </ul>

            <button
              class="absolute bottom-[15px] right-[15px] bg-transparent border-none cursor-pointer flex items-center justify-center w-10 h-10 p-0 text-black hover:opacity-70 transition-opacity"
              @click="sortDesc = !sortDesc"
              title="Змінити напрямок"
            >
              <svg v-if="!sortDesc" viewBox="0 0 24 24" class="w-7 h-7 shrink-0">
                <path d="M4 18h4v-2H4v2zm0-5h8v-2H4v2zm0-7v2h12V6H4zm15 8v-4h-2v4h-3l4 4 4-4h-3z" fill="currentColor"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-7 h-7 shrink-0">
                <path d="M4 18h4v-2H4v2zm0-5h8v-2H4v2zm0-7v2h12V6H4zm14 8h3l-4-4-4 4h3v4h2v-4z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Об'єднаний список -->
    <transition 
      mode="out-in"
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div 
        :key="activeTab" 
        class="flex flex-col gap-[15px] max-h-[550px] overflow-y-auto p-5 bg-[#FFF1DB] rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#FFE6BD] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-[#7E4864] [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-[#61344B]"
      >
        
        <div v-if="isLoading && currentItems.length === 0" class="text-center text-base text-[#4A3A41] py-5">
          Завантаження {{ activeTab === 'works' ? 'творів' : 'чернеток' }}...
        </div>
        <div v-else-if="!isLoading && currentItems.length === 0" class="text-center text-base text-[#4A3A41] py-5">
          {{ activeTab === 'works' ? 'Творів' : 'Чернеток' }} не знайдено.
        </div>
        
        <transition-group 
          v-else 
          tag="div" 
          class="flex flex-col gap-[15px] relative w-full"
          :class="{ 'opacity-50 pointer-events-none transition-opacity duration-300': isLoading }"
          enter-active-class="transition-all duration-500 ease-out"
          leave-active-class="transition-all duration-500 ease-in absolute w-full"
          move-class="transition-all duration-500 ease-in-out"
          enter-from-class="opacity-0 translate-y-5 scale-95"
          leave-to-class="opacity-0 translate-y-5 scale-95"
        >
          <div v-for="item in currentItems" :key="item.postId || item.id" class="bg-[#4f9689] border-4 border-[#1c4b43] rounded relative min-h-[140px] flex items-center justify-center box-border w-full">
            
            <div class="text-center">
              <h3 class="m-0 mb-1 font-medium text-black text-lg">{{ item.title }}</h3>
              <span class="text-black text-sm">
                {{ item.genres && item.genres.length > 0 ? item.genres[0] : 'Без жанру' }}
              </span>
            </div>

            <!-- Статистика показується ТІЛЬКИ для творів -->
            <div v-if="activeTab === 'works'" class="absolute bottom-[15px] left-5 text-black text-sm flex gap-5">
              <span>{{ item.likesCount || 0 }} лайків</span>
              <span>{{ item.commentsCount || 0 }} коментів</span>
            </div>

            <div class="absolute bottom-[15px] right-5 flex items-center gap-3 z-10">
              <!-- Кнопка 'Читати' для творів, 'Редагувати' для чернеток -->
              <button 
                v-if="activeTab === 'works'" 
                class="bg-[#1e4b6c] text-white border-none rounded-md py-2 px-[30px] font-sans text-base cursor-pointer transition-colors hover:bg-[#15364e] h-fit"
              >
                Читати
              </button>
              <button 
                v-else 
                @click="navigateTo(`/write/${item.postId || item.id}`)" 
                class="bg-[#1e4b6c] text-white border-none rounded-md py-2 px-[30px] font-sans text-base cursor-pointer transition-colors hover:bg-[#15364e] h-fit"
              >
                Редагувати
              </button>
              
              <!-- Кнопка 'Видалити' (для власника) -->
              <button 
                v-if="props.isOwner"
                class="bg-transparent border-2 border-[#1c4b43] rounded-full w-8 h-8 flex items-center justify-center text-[#1c4b43] cursor-pointer transition-all shrink-0 hover:bg-[#1c4b43] hover:text-[#4f9689] hover:scale-110"
                @click="openDeleteModal(item)"
                :title="activeTab === 'works' ? 'Видалити твір' : 'Видалити чернетку'"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

          </div>
        </transition-group>
      </div>
    </transition>

    <DeletePost 
      :isOpen="isDeleteModalOpen" 
      @close="closeDeleteModal" 
      @confirm="handleDeleteConfirm" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DeletePost from './deletePost.vue' // Назва імпорту залишена твоєю, щоб не зламати проект

const props = defineProps({
  username: { type: String, required: true },
  isOwner: { type: Boolean, default: false },
  isAuthor: { type: Boolean, default: false } 
})

const config = useRuntimeConfig()
const activeTab = ref('works')
const isLoading = ref(false)

const sortBy = ref('Title')
const sortDesc = ref(false)
const isSortMenuOpen = ref(false)

// Зберігаємо обидва списки в пам'яті, щоб уникнути зайвих запитів при швидкому перемиканні
const works = ref([])
const drafts = ref([])

// Обчислюємо, які дані наразі треба показувати
const currentItems = computed(() => {
  return activeTab.value === 'works' ? works.value : drafts.value
})

const isDeleteModalOpen = ref(false)
const itemToDelete = ref(null) 

const openDeleteModal = (item) => {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDelete.value = null
}

const handleDeleteConfirm = async () => {
  if (!itemToDelete.value) return;
  
  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014';
    const token = useCookie('auth_token').value; 
    const id = itemToDelete.value.postId || itemToDelete.value.id;

    await $fetch(`${baseUrl}/api/Posts/${id}/delete-post`, {
      method: 'POST', 
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Оновлюємо відповідний масив
    if (activeTab.value === 'works') {
      works.value = works.value.filter(w => (w.postId || w.id) !== id);
    } else {
      drafts.value = drafts.value.filter(d => (d.postId || d.id) !== id);
    }
    
    console.log(`Успішно видалено`);
  } catch (error) {
    console.error("Помилка при видаленні:", error);
  } finally {
    closeDeleteModal();
  }
}

const fetchItems = async () => {
  if (!props.isAuthor) return 
  
  isLoading.value = true
  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014'
    const isWorksTab = activeTab.value === 'works'
    const token = useCookie('auth_token').value;
    
    if (isWorksTab) {
      const data = await $fetch(`${baseUrl}/api/Posts/get-posts`, {
        method: 'GET',
        params: {
          Username: props.username,
          Filter: sortBy.value,
          Ascending: !sortDesc.value
        }
      })
      works.value = data
    } else {
      if (!token) throw new Error('Немає токена');
      const data = await $fetch(`${baseUrl}/api/Posts/get-drafts`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          Filter: sortBy.value,
          Ascending: !sortDesc.value
        }
      })
      drafts.value = data
    }
  } catch (e) { 
    console.error("Помилка завантаження даних:", e) 
    if (activeTab.value === 'works') works.value = []
    else drafts.value = []
  } finally { 
    isLoading.value = false 
  }
}

// Слухаємо зміни табу, сортування та завантажуємо актуальні дані
watch([activeTab, sortBy, sortDesc], () => {
  fetchItems()
}, { immediate: true })
</script>