<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['author-created'])
const errorMessage = ref('');

const isFormModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const authorText = ref('')
const isLoading = ref(false) 

const openFormModal = () => {
  isFormModalOpen.value = true
}

const submitForm = async () => {
  if (!authorText.value.trim() || isLoading.value) return;

  isLoading.value = true;

  try {
    const config = useRuntimeConfig();
    const token = useCookie('auth_token').value; 
    
    await $fetch<any>(`${config.public.apiBase}/api/BecomeAuthor/become-author-button`, {
      method: 'POST', 
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
    
      body: authorText.value.trim() 
    });

    isFormModalOpen.value = false;
    isSuccessModalOpen.value = true;
    authorText.value = ''; 
    
    emit('author-created');

  } catch (error: any) {
    console.error('Помилка при відправці заявки:', error);
    errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
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
  <div class="become-author-container">
    
    <button class="become-author-btn" @click="openFormModal">
      Стати автором
    </button>

    <div v-if="isFormModalOpen" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content form-modal">
        <h3 class="modal-title">Напишіть, чому ви хочете стати автором та щось про себе :)</h3>
        <p class="modal-subtitle">Ви станете автором назавжди)</p>
        <div class="textarea-wrapper">
          <textarea 
            v-model="authorText" 
            maxlength="500"
            placeholder="Ваша розповідь..."
            :disabled="isLoading"
          ></textarea>
          <span class="char-count">{{ authorText.length }}/500</span>
        </div>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        <button class="submit-btn" @click="submitForm" :disabled="!authorText.trim() || isLoading">
          <svg class="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M4 12L9 17L20 6" 
              stroke="black" 
              stroke-width="3.8" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isSuccessModalOpen" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content success-modal">
        <h2 class="success-title">Вітаємо!</h2>
        <p class="success-subtitle">Ви стали автором!</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.become-author-container { 
  display: inline-block; 
  font-family: 'Montserrat', sans-serif; 
}

.become-author-btn {
  background-color: #54bfb0; 
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  cursor: pointer;
  border: 3px solid #1a5e55;
}

.modal-overlay {
  position: fixed; 
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex; 
  justify-content: center; 
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #dcbccd; 
  border: 4px solid #73485e; 
  border-radius: 28px;
  width: 90%; 
  max-width: 450px;
  text-align: center;
  position: relative; 
  box-sizing: border-box;
  color: #73485e;
  font-family: 'Montserrat', sans-serif; 
}

.form-modal {
  padding: 35px 25px 70px 25px; 
}

.modal-title {
  font-size: 19px;
  margin-bottom: 25px;
  font-weight: 600;
  line-height: 1.3;
}

.textarea-wrapper { 
  position: relative; 
  width: 100%; 
}

textarea {
  width: 100%; 
  height: 180px;
  background-color: #f3f0f2; 
  border: none; 
  border-radius: 15px;
  padding: 15px; 
  resize: none; 
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box; 
  color: #333;
  outline: none;
}

textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.char-count {
  position: absolute; 
  bottom: 12px; 
  right: 15px;
  font-size: 12px; 
  color: #999;
}

.submit-btn {
  background: none; 
  border: none; 
  cursor: pointer; 
  padding: 0;
  position: absolute;
  bottom: 15px; 
  left: 10px;   
  transition: transform 0.2s ease;
}

.check-icon {
  width: 50px; 
  height: 50px;
}

.submit-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.success-modal {
  padding: 80px 40px;
}

.success-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0;
}

.success-subtitle {
  font-size: 20px;
  margin: 10px 0 0 0;
}
</style>