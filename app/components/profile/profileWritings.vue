<script setup>
import { ref, computed, watch } from 'vue'
import DeletePost from '@/components/posts/deletePost.vue'

const props = defineProps({
  username: { type: String, required: true },
  isOwner: { type: Boolean, default: false },
  isAuthor: { type: Boolean, default: false }
})

const config = useRuntimeConfig()
const { token, nickname } = useAuth();

const activeTab = ref('works')
const isLoading = ref(false)

const sortBy = ref('Title')
const sortDesc = ref(false)
const isSortMenuOpen = ref(false)

const works = ref([])
const drafts = ref([])

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
    const id = itemToDelete.value.postId || itemToDelete.value.id;

    await $fetch(`${baseUrl}/api/Posts/${id}/delete-post`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token.value}` }
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

    const queryParams = {
      filter: sortBy.value,
      ascending: !sortDesc.value
    }

    if (isWorksTab) {
      works.value = await $fetch(`${baseUrl}/api/posts/user/${props.username}`, {
        method: 'GET',
        params: queryParams
      })
    } else {
      if (!token.value) throw new Error('Немає токена авторизації')

      drafts.value = await $fetch(`${baseUrl}/api/posts/drafts`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token.value}` },
        params: queryParams
      })
    }
  } catch (e) {
    console.error("Помилка завантаження даних:", e)
    if (isWorksTab) works.value = []
    else drafts.value = []
  } finally {
    isLoading.value = false
  }
}

watch([activeTab, sortBy, sortDesc], () => {
  fetchItems()
}, { immediate: true })
</script>

<template>
  <div v-if="props.isAuthor" class="w-full relative font-sans">

    <!-- Header -->
    <div class="relative flex justify-center items-center mb-5">
      <!-- Tabs -->
      <div class="flex justify-center items-center text-lg">
        <button
          :class="['bg-transparent border-none cursor-pointer transition-colors duration-300', activeTab === 'works' ? 'text-mint font-semibold' : 'text-muted']"
          @click="activeTab = 'works'">
          Твори
        </button>

        <template v-if="props.isOwner">
          <span class="mx-[15px] text-muted">|</span>
          <button
            :class="['bg-transparent border-none cursor-pointer transition-colors duration-300', activeTab === 'drafts' ? 'text-mint font-semibold' : 'text-muted']"
            @click="activeTab = 'drafts'">
            Чернетки
          </button>
        </template>
      </div>

      <!-- Sort -->
      <div class="absolute right-0 top-0 bottom-0 flex items-center">
        <button class="bg-transparent border-none cursor-pointer text-base text-muted underline underline-offset-4"
          @click="isSortMenuOpen = true">
          Сортувати
        </button>

        <!-- Overlay -->
        <transition enter-active-class="transition-opacity duration-300"
          leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
          <div v-if="isSortMenuOpen" class="fixed inset-0 w-screen h-screen bg-black/40 z-[1000] cursor-pointer"
            @click="isSortMenuOpen = false"></div>
        </transition>

        <!-- Menu -->
        <transition enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 -translate-y-2.5 scale-95" leave-to-class="opacity-0 -translate-y-2.5 scale-95">
          <div v-if="isSortMenuOpen"
            class="absolute top-full right-0 mt-1.5 bg-cream-dark border-4 border-plum rounded-xl py-5 px-[30px] min-w-[260px] text-white shadow-2xl z-[1002]"
            @click.stop>
            <button
              class="absolute top-[15px] right-[15px] bg-transparent border-none cursor-pointer text-muted p-0 flex items-center justify-center transition-opacity hover:opacity-70"
              @click="isSortMenuOpen = false" title="Закрити меню">
              <svg viewBox="0 0 24 24" class="w-6 h-6">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor" />
              </svg>
            </button>

            <h4 class="m-0 mb-[15px] font-medium text-xl text-muted pr-[25px]">Сортувати за:</h4>

            <ul class="list-none p-0 m-0">
              <li
                class="flex items-center gap-3 mb-3 cursor-pointer text-lg text-muted font-medium transition-opacity hover:opacity-80"
                @click="sortBy = 'Title'">
                <span
                  :class="['w-3.5 h-3.5 border-2 border-white rounded-full inline-block transition-colors', sortBy === 'Title' ? 'bg-muted' : 'bg-transparent']"></span>
                Назвою
              </li>
              <li
                class="flex items-center gap-3 mb-3 cursor-pointer text-lg text-muted font-medium transition-opacity hover:opacity-80"
                @click="sortBy = 'Description'">
                <span
                  :class="['w-3.5 h-3.5 border-2 border-white rounded-full inline-block transition-colors', sortBy === 'Description' ? 'bg-muted' : 'bg-transparent']"></span>
                Описом
              </li>
              <li
                class="flex items-center gap-3 mb-3 cursor-pointer text-lg text-muted font-medium transition-opacity hover:opacity-80"
                @click="sortBy = 'CreatedAt'">
                <span
                  :class="['w-3.5 h-3.5 border-2 border-white rounded-full inline-block transition-colors', sortBy === 'CreatedAt' ? 'bg-muted' : 'bg-transparent']"></span>
                Датою
              </li>
            </ul>

            <button
              class="absolute bottom-[15px] right-[15px] bg-transparent border-none cursor-pointer flex items-center justify-center w-10 h-10 p-0 text-black hover:opacity-70 transition-opacity"
              @click="sortDesc = !sortDesc" title="Змінити напрямок">
              <svg v-if="!sortDesc" viewBox="0 0 24 24" class="w-7 h-7 shrink-0 text-main">
                <path d="M4 18h4v-2H4v2zm0-5h8v-2H4v2zm0-7v2h12V6H4zm15 8v-4h-2v4h-3l4 4 4-4h-3z" fill="currentColor" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-7 h-7 shrink-0">
                <path d="M4 18h4v-2H4v2zm0-5h8v-2H4v2zm0-7v2h12V6H4zm14 8h3l-4-4-4 4h3v4h2v-4z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Об'єднаний список -->
    <transition mode="out-in" enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in" enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div :key="activeTab"
        class="flex flex-col gap-[15px] max-h-[1500px] overflow-y-auto p-5 bg-cream-light rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-cream-light [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-plum-scroll [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-plum">

        <div v-if="isLoading && currentItems.length === 0" class="text-center text-base text-muted py-5">
          Завантаження {{ activeTab === 'works' ? 'творів' : 'чернеток' }}...
        </div>
        <div v-else-if="!isLoading && currentItems.length === 0" class="text-center text-base text-muted py-5">
          {{ activeTab === 'works' ? 'Творів' : 'Чернеток' }} не знайдено.
        </div>

        <transition-group v-else tag="div" class="flex flex-col gap-[15px] relative w-full"
          :class="{ 'opacity-50 pointer-events-none transition-opacity duration-300': isLoading }"
          enter-active-class="transition-all duration-500 ease-out"
          leave-active-class="transition-all duration-500 ease-in absolute w-full"
          move-class="transition-all duration-500 ease-in-out" enter-from-class="opacity-0 translate-y-5 scale-95"
          leave-to-class="opacity-0 translate-y-5 scale-95">
          <div v-for="item in currentItems" :key="item.postId || item.id"
            class="bg-mint border-4 border-mint-dark rounded relative min-h-[140px] flex items-center justify-center box-border w-full">

            <div class="text-center flex flex-col items-center gap-1.5">
              <h3 class="m-0 font-medium text-main text-lg">{{ item.title }}</h3>

              <div class="flex flex-wrap justify-center items-center gap-1.5">
                <template v-if="item.genres && item.genres.length > 0">
                  <span v-for="genre in item.genres" :key="genre"
                    class="px-2 py-0.5 bg-cream-light border border-cream-input text-main rounded-lg text-xs font-medium shadow-sm">
                    {{ genre }}
                  </span>
                </template>
                <template v-else>
                  <span class="text-muted text-sm italic">
                    Без жанру
                  </span>
                </template>
              </div>
            </div>

            <!-- Статистика показується ТІЛЬКИ для творів -->
            <div v-if="activeTab === 'works'" class="absolute bottom-[15px] left-5 text-black text-sm flex gap-5">
              <span>{{ item.likesCount || 0 }} лайків</span>
              <span>{{ item.commentsCount || 0 }} коментів</span>
            </div>

            <div class="absolute bottom-[15px] right-5 flex items-center gap-3 z-10">
              <!-- Кнопка 'Читати' для творів, 'Редагувати' для чернеток -->
              <button v-if="activeTab === 'works'" @click="navigateTo(`/read/${item.postId || item.id}`)"
                class="bg-mint-dark text-white border-none rounded-md py-2 px-[30px] font-sans text-base cursor-pointer transition-colors hover:bg-mint-hover h-fit">
                Читати
              </button>
              <button v-else @click="navigateTo(`/write/${item.postId || item.id}`)"
                class="bg-mint-light text-main border-none rounded-md py-2 px-[30px] font-sans text-base cursor-pointer transition-colors hover:bg-mint-hover h-fit">
                Редагувати
              </button>

              <!-- Кнопка 'Видалити' (для власника) -->
              <button v-if="props.isOwner"
                class="bg-transparent border-2 border-mint-dark rounded-full w-8 h-8 flex items-center justify-center text-mint-dark cursor-pointer transition-all shrink-0 hover:bg-mint-dark hover:text-mint hover:scale-110"
                @click="openDeleteModal(item)" :title="activeTab === 'works' ? 'Видалити твір' : 'Видалити чернетку'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
            </div>

          </div>
        </transition-group>
      </div>
    </transition>

    <DeletePost :isOpen="isDeleteModalOpen" @close="closeDeleteModal" @confirm="handleDeleteConfirm" />
  </div>
</template>