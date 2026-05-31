<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['author-created'])
const errorMessage = ref('');

const isFormModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const authorText = ref('')
const isLoading = ref(false) 
const { token, nickname } = useAuth();

const openFormModal = () => {
  isFormModalOpen.value = true
  errorMessage.value = ''
}

const submitForm = async () => {
  if (!authorText.value.trim() || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const config = useRuntimeConfig();
    
    await $fetch<any>(`${config.public.apiBase}/api/BecomeAuthor/become-author-button`, {
      method: 'POST', 
      headers: {
        'Authorization': token.value ? `Bearer ${token.value}` : ''
      },
      body: {
        authorBio: authorText.value.trim() 
      }
    });

    isFormModalOpen.value = false;
    isSuccessModalOpen.value = true;
    authorText.value = ''; 
    
    emit('author-created');

  } catch (error: any) {
    console.error('Помилка при відправці заявки:', error);
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else {
      errorMessage.value = error.data?.message || 'Сталася помилка при відправці. Спробуйте пізніше.';
    }
  } finally {
    isLoading.value = false; 
  }
}

const closeModals = () => {
  isFormModalOpen.value = false
  isSuccessModalOpen.value = false
}
</script>

<template>
  <div class="inline-block font-sans">
    
    <!-- Кнопка відкриття -->
    <button 
      class="bg-mint-light text-white py-3 px-6 rounded-lg text-base font-bold cursor-pointer border-[3px] bg-mint-dark transition-all hover:bg-mint active:scale-95" 
      @click="openFormModal"
    >
      Стати автором
    </button>

    <!-- Модалка з формою -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isFormModalOpen" class="fixed inset-0 w-screen h-screen bg-black/30 flex justify-center items-center z-[1000]" @click.self="closeModals">
        <transition
          appear
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div class="bg-mauve-light border-4 border-plum-light rounded-[28px] w-[90%] max-w-[450px] text-center relative box-border text-plum-light pt-[35px] px-6 pb-[70px]">
            <h3 class="text-[19px] mb-2 font-semibold leading-[1.3]">Напишіть, чому ви хочете стать автором та щось про себе :)</h3>
            <p class="text-sm opacity-80 mb-6">Ви станете автором назавжди)</p>
            
            <div class="relative w-full">
              <textarea 
                v-model="authorText" 
                maxlength="500"
                placeholder="Ваша розповідь..."
                :disabled="isLoading"
                class="w-full h-[180px] bg-cream-input border-none rounded-[15px] p-[15px] resize-none text-base text-muted outline-none disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-plum-light/50"
              ></textarea>
              <span class="absolute bottom-3 right-[15px] text-xs text-muted font-medium">
                {{ authorText.length }}/500
              </span>
            </div>
            
            <p v-if="errorMessage" class="text-[#8b0000] text-sm mt-3 font-medium text-left px-1">{{ errorMessage }}</p>
            
            <!-- Кнопка відправки (галочка) -->
            <button 
              class="bg-transparent border-none cursor-pointer p-0 absolute bottom-[15px] left-2.5 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 active:scale-95" 
              @click="submitForm" 
              :disabled="!authorText.trim() || isLoading"
            >
              <svg class="w-[50px] h-[50px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M4 12L9 17L20 6" 
                  stroke="currentColor" 
                  stroke-width="3.8" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Модалка успіху -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isSuccessModalOpen" class="fixed inset-0 w-screen h-screen bg-black/30 flex justify-center items-center z-[1000]" @click.self="closeModals">
        <transition
          appear
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div class="bg-mauve-light border-4 border-plum-light rounded-[28px] w-[90%] max-w-[450px] text-center relative box-border text-plum-light py-20 px-10 shadow-2xl">
            <h2 class="text-[36px] font-extrabold m-0">Вітаємо!</h2>
            <p class="text-xl m-0 mt-2.5 font-medium">Ви стали автором!</p>
          </div>
        </transition>
      </div>
    </transition>

  </div>
</template>