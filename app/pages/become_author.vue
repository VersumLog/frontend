<template>
  <div class="become-author-container">
    
    <button class="become-author-btn" @click="openFormModal">
      Стати автором
    </button>

    <div v-if="isFormModalOpen" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content form-modal">
        <h3 class="modal-title">Напишіть чому ви хочете стати автором та щось про себе :)</h3>
        
        <div class="textarea-wrapper">
          <textarea 
            v-model="authorText" 
            maxlength="500"
            placeholder="Ваша розповідь..."
          ></textarea>
          <span class="char-count">{{ authorText.length }}/500</span>
        </div>

        <button class="submit-btn" @click="submitForm" :disabled="!authorText.trim()">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isSuccessModalOpen" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content success-modal">
        <h2 class="success-title">Вітаємо!</h2>
        <p class="success-text">Ви стаєте автором<br>назавжди)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isFormModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const authorText = ref('')
const openFormModal = () => {
  isFormModalOpen.value = true
}

const submitForm = () => {
  if (authorText.value.trim()) {
 
    console.log("Текст автора:", authorText.value);
    
    isFormModalOpen.value = false
    isSuccessModalOpen.value = true
    authorText.value = '' 
  }
}

const closeModals = () => {
  isFormModalOpen.value = false
  isSuccessModalOpen.value = false
}
</script>

<style scoped>
.become-author-container {
  display: inline-block; 
}

.become-author-btn {
  background-color: #54bfb0; 
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  border: 3px solid #1a5e55; 
}

.become-author-btn:hover {
  background-color: #4fb4a4; 
  border-color: #144b44; 
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px); 
}

.become-author-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  background-color: #dcbccd; 
  border: 4px solid #73485e; 
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  color: #73485e;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.form-modal {
  padding: 24px;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 16px;
}

.textarea-wrapper {
  position: relative;
  width: 100%;
}

textarea {
  width: 100%;
  height: 150px;
  background-color: #f5f0f3; 
  border: none;
  border-radius: 8px;
  padding: 12px;
  resize: none;
  font-size: 14px;
  box-sizing: border-box;
  color: #333;
}

textarea:focus {
  outline: 2px solid #73485e;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #333;
}

.submit-btn {
  position: absolute;
  bottom: 12px;
  left: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
}

.submit-btn:hover {
  transform: scale(1.1);
}

.submit-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.success-modal {
  padding: 40px 24px;
}

.success-title {
  font-size: 26px;
  font-weight: 400;
  margin: 0 0 8px 0;
}

.success-text {
  font-size: 22px;
  font-weight: 400;
  margin: 0;
}
</style>
