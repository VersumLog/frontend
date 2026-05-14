<template>
  <div class="font-['Montserrat'] relative w-full">
    <div class="flex flex-wrap items-center gap-8 text-xl font-bold text-[#0f2130]">
      
      <!-- Використовуємо props для відображення цифр -->
      <button 
        @click="openModal('followings')"
        class="relative z-[999] flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <span>Підписок</span>
        <span class="text-black">{{ followingCount }}</span>
      </button>

      <button 
        @click="openModal('followers')"
        class="relative z-[999] flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <span>Підписників</span>
        <span class="text-black">{{ followersCount }}</span>
      </button>

      <button 
        @click="openModal('works')"
        class="relative z-[999] flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 transition-opacity hover:opacity-70 focus:outline-none"
      >
        <span>Творів</span>
        <span class="text-black">{{ worksCount }}</span>
      </button>
      
    </div>

    <ClientOnly>
      <Teleport to="body">
        <Transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="isModalOpen" 
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" 
            @click.self="closeModal"
          >
            <Transition 
              enter-active-class="transition duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-300 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0"
            >
              <div class="relative w-full max-w-sm overflow-hidden rounded-2xl border-4 border-[#744458] bg-[#E5C5D5] shadow-2xl">
                
                <button 
                  @click="closeModal" 
                  class="absolute right-4 top-4 z-10 cursor-pointer border-none bg-transparent text-[#744458] transition-transform hover:scale-110 focus:outline-none"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>

                <div class="custom-scrollbar max-h-[70vh] overflow-y-auto p-6">
                  <div class="mb-6 pt-2 text-center">
                    <h3 class="text-xl font-bold text-[#744458]">
                      {{ 
                        modalType === 'followers' ? 'Ваші підписники' : 
                        (modalType === 'followings' ? 'Ваші підписки' : 'Ваші твори') 
                      }}
                    </h3>
                  </div>

                  <div class="space-y-3">
                    <div 
                      v-for="item in currentList" 
                      :key="item.id"
                      class="flex items-center gap-4 rounded-xl border border-[#744458]/20 bg-white/30 p-3 transition-colors hover:bg-white/50"
                    >
                      <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#744458] text-white">
                        <span v-if="modalType === 'works'" class="text-lg">📖</span>
                        <span v-else class="font-bold">{{ item.name.charAt(0).toUpperCase() }}</span>
                      </div>
                      
                      <span class="text-[1.1rem] font-medium text-black line-clamp-2 leading-tight">
                        {{ item.name }}
                      </span>
                    </div>

                    <div v-if="currentList.length === 0" class="py-6 text-center font-medium text-[#744458]/60">
                      Список порожній.
                    </div>
                  </div>

                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Отримуємо реальні дані кількості від батьківського компонента
const props = defineProps<{
  worksCount: number;
  followingCount: number;
  followersCount: number;
}>();

const isModalOpen = ref(false)
const modalType = ref<'followers' | 'followings' | 'works' | null>(null)

// Тимчасові дані (мокові) для списку в модалці. 
// В майбутньому ви можете додавати тут API запити для отримання списків при відкритті модалки.
const followersList = ref([
  { id: 1, name: 'Ravlyk Bob' },
  { id: 2, name: 'Alice' },
])

const followingsList = ref([
  { id: 1, name: 'Taras' },
  { id: 2, name: 'Lesya' },
])

const worksList = ref([
  { id: 1, name: 'Тяжкий тиждень' },
  { id: 2, name: 'Літо літечко' },
  { id: 3, name: 'Я їду в Карпати' },
])

const currentList = computed(() => {
  if (modalType.value === 'followers') return followersList.value;
  if (modalType.value === 'followings') return followingsList.value;
  if (modalType.value === 'works') return worksList.value;
  return [];
})

const openModal = (type: 'followers' | 'followings' | 'works') => {
  modalType.value = type
  isModalOpen.value = true
  
  // TODO: Тут можна додати виклик API (наприклад, fetchFollowers()), 
  // щоб оновити масиви (followersList) реальними даними при відкритті.
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    modalType.value = null
  }, 300)
}
</script>

<style scoped>
/* Стилі залишаються без змін */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #744458;
  border-radius: 10px;
}
</style>