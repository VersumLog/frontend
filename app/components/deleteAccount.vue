<template>
  <div class="delete-account-container">
    
    <button class="delete-account-btn" @click="openModal">
      Видалити акаунт
    </button>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        
        <div v-if="step === 1" class="step-container">
          <h3 v-if="!hasPasswordError" class="modal-title">
            Введіть свій пароль, щоб видалити акаунт
          </h3>
          <h3 v-else class="modal-title">
            Неправильний пароль :(<br>введіть ще раз або вийдіть
          </h3>
          
          <input 
            type="password" 
            v-model="password" 
            placeholder="Введіть пароль"
            class="modal-input"
            @keyup.enter="submitPassword"
          />
          
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
          <button class="confirm-btn" @click="submitPassword" :disabled="!password.trim()">
            Підтвердити
          </button>
          
        </div>

        <div v-if="step === 2" class="step-container">
          <h3 class="modal-title">
            Введіть слово "<strong>видалити</strong>", щоб остаточно підтвердити видалення акаунта
          </h3>
          
          <input 
            type="text" 
            v-model="confirmationWord" 
            placeholder="Введіть слово"
            class="modal-input"
            @keyup.enter="submitFinal"
          />
          
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
          
          <button class="confirm-btn" @click="submitFinal" :disabled="!confirmationWord.trim()">
            Підтвердити
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isModalOpen = ref(false)
const step = ref(1)
const password = ref('')
const confirmationWord = ref('')
const hasPasswordError = ref(false)

const errorMessage = ref('');

const CORRECT_PASSWORD_MOCK = "12345"

const openModal = () => {
  isModalOpen.value = true
  step.value = 1
  password.value = ''
  confirmationWord.value = ''
  hasPasswordError.value = false
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitPassword = () => {
  if (!password.value.trim()) return
  step.value = 2
  hasPasswordError.value = false
}

const submitFinal = async () => {
  if (!confirmationWord.value.trim()) return

  if (confirmationWord.value.trim().toLowerCase() === 'видалити') {
    try {
      const config = useRuntimeConfig();
      const token = useCookie('auth_token').value; 
      const response = await $fetch(`${config.public.apiBase}/api/Profile/delete-account`, {
        method: 'POST', 
        headers: {
        'Authorization': token ? `Bearer ${token}` : ''
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

<style scoped>
.delete-account-container {
  display: inline-block;
}

.delete-account-btn {
  background-color: #55bba6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 4px solid #1a5e55;
}

.delete-account-btn:hover {
  background-color: #4eb09c;
  transform: translateY(-1px);
}

.delete-account-btn:active {
  transform: translateY(0);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #55bba6; 
  border: 4px solid #1a5e55; 
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  padding: 30px 24px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  color: #000;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.step-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 24px;
  line-height: 1.4;
}

.modal-title strong {
  font-weight: bold;
}

.modal-input {
  width: 100%;
  max-width: 350px;
  background-color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 30px;
  color: #333;
}
.modal-input:focus {
  outline: 2px solid #1a5e55;
}

.confirm-btn {
  background-color: #1a5e55;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.confirm-btn:hover {
  background-color: #144b44;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>