
<script setup lang="ts">

import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'


const isModalOpen = ref(false)
const step = ref(1)
const password = ref('')
const confirmationWord = ref('')
const hasPasswordError = ref(false)
const { token, nickname } = useAuth();

const errorMessage = ref('');

const openModal = () => {
  isModalOpen.value = true
  step.value = 1
  password.value = ''
  confirmationWord.value = ''
  hasPasswordError.value = false
  errorMessage.value = ''
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitPassword = () => {
  if (!password.value.trim()) return
  step.value = 2
  hasPasswordError.value = false
  errorMessage.value = ''
}

const submitFinal = async () => {
  if (!confirmationWord.value.trim()) return

  if (confirmationWord.value.trim().toLowerCase() === 'видалити') {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`${config.public.apiBase}/api/Profile/delete-account`, {
        method: 'POST', 
        headers: {
          'Authorization': token.value ? `Bearer ${token.value}` : ''
        },
        body: {
          password: password.value
        }
      });

      console.log("Акаунт успішно видалено!", response);
      closeModal();
      
    } catch (error: any) {
      if (error.data?.errors) {
        errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
      } else {
        errorMessage.value = error.data?.message || "Не вдалося змінити пароль";
      }
      
      step.value = 1;
      hasPasswordError.value = true;
      password.value = '';
      confirmationWord.value = '';
    }
  } else {
      errorMessage.value = "Слово введено неправильно. Спробуйте ще раз.";
  }
}
</script>

<template>
  <div class="inline-block font-sans">
    
    <!-- Кнопка відкриття модалки -->
    <button 
      class="bg-plum hover:bg-plum-hover text-white border-2 border-transparent py-2.5 px-6 text-base font-bold rounded-xl cursor-pointer shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap"
      @click="openModal"
    >
      Видалити акаунт
    </button>

    <!-- Оверлей модалки з анімацією -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 w-screen h-screen bg-black/40 flex justify-center items-center z-[1000]" @click.self="closeModal">
        
        <!-- Контент модалки з анімацією виринання -->
        <transition
          appear
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div class="bg-mint-light border-4 bg-mint-dark rounded-2xl w-[90%] max-w-[450px] py-[30px] px-6 text-center relative box-border text-black shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
            
            <!-- Крок 1: Пароль -->
            <div v-if="step === 1" class="flex flex-col items-center">
              <h3 v-if="!hasPasswordError" class="text-lg font-normal mt-0 mb-6 leading-[1.4]">
                Введіть свій пароль, щоб видалити акаунт
              </h3>
              <h3 v-else class="text-lg font-normal mt-0 mb-6 leading-[1.4]">
                Неправильний пароль :(<br>введіть ще раз або вийдіть
              </h3>
              
              <input 
                type="password" 
                v-model="password" 
                placeholder="Введіть пароль"
                class="w-full max-w-[350px] bg-white border-none rounded-xl py-[14px] px-4 text-base box-border mb-[30px] text-muted focus:outline focus:outline-2 focus:outline-mint-dark"
                @keyup.enter="submitPassword"
              />
              
              <p v-if="errorMessage" class="text-[#8b0000] text-sm mb-[15px] font-medium">{{ errorMessage }}</p>
              
              <button 
                class="bg-mint-dark text-white border-none rounded-lg py-3 px-6 text-base cursor-pointer transition-colors duration-200 hover:bg-mint-dark disabled:opacity-50 disabled:cursor-not-allowed" 
                @click="submitPassword" 
                :disabled="!password.trim()"
              >
                Підтвердити
              </button>
            </div>

            <!-- Крок 2: Слово підтвердження -->
            <div v-if="step === 2" class="flex flex-col items-center">
              <h3 class="text-lg font-normal mt-0 mb-6 leading-[1.4]">
                Введіть слово "<strong class="font-bold">видалити</strong>", щоб остаточно підтвердити видалення акаунта
              </h3>
              
              <input 
                type="text" 
                v-model="confirmationWord" 
                placeholder="Введіть слово"
                class="w-full max-w-[350px] bg-white border-none rounded-xl py-[14px] px-4 text-base box-border mb-[30px] text-muted focus:outline focus:outline-2 focus:outline-mint-dark"
                @keyup.enter="submitFinal"
              />
              
              <p v-if="errorMessage" class="text-[#8b0000] text-sm mb-[15px] font-medium">{{ errorMessage }}</p>
              
              <button 
                class="bg-mint-dark text-white border-none rounded-lg py-3 px-6 text-base cursor-pointer transition-colors duration-200 hover:bg-mint-dark disabled:opacity-50 disabled:cursor-not-allowed" 
                @click="submitFinal" 
                :disabled="!confirmationWord.trim()"
              >
                Підтвердити
              </button>
            </div>

          </div>
        </transition>
      </div>
    </transition>

  </div>
</template>