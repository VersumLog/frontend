<template>
  <div class="author-profile">
    
    <div v-if="!isModalOpen" class="main-view">
      
      <button class="open-modal-btn" @click="openModal">
        <img src="./pen.png" alt="Edit" style="width: 100%; height: 100%; object-fit: contain;" />
      </button>

      <div v-if="isBlockVisible" class="display-block">
        <h2 class="display-title">Чому я став автором?</h2>
        <p class="display-text">{{ displayedText }}</p>
      </div>

    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        
        <h3 v-if="isEditing" class="modal-title">Редагуємо</h3>
        
        <div class="textarea-wrapper">
          <textarea 
            v-model="draftText" 
            maxlength="500"
            :readonly="!isEditing || isLoading"
            :class="{ 'is-loading': isLoading }"
          ></textarea>
          <span class="char-count">{{ draftText.length }}/500</span> 
        </div>

        <button v-if="!isEditing" class="btn-primary" @click="startEditing">
          Редагувати
        </button>

        <div v-if="isEditing" class="action-icons">
          <button class="icon-btn check-btn" @click="save" :disabled="isLoading || !draftText.trim()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12L9 17L20 6" stroke="black" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button class="icon-btn close-btn" @click="cancel" :disabled="isLoading">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M6 18L18 6" stroke="black" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isBlockVisible = ref(false) 
const isLoading = ref(false)

const displayedText = ref('')
const draftText = ref('')

onMounted(async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie('auth_token').value;
    
    const response = await $fetch(`${config.public.apiBase}/api/BecomeAuthor/${props.username}/author-bio`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    const bioText = response?.authorBio || response || '';
    
    if (bioText) {
      displayedText.value = bioText;
      isBlockVisible.value = true;
    }
  } catch (error) {
    console.error('Помилка при завантаженні біографії:', error);
  }
})

const openModal = () => {
  draftText.value = displayedText.value
  isEditing.value = false
  isModalOpen.value = true
}

const startEditing = () => {
  isEditing.value = true
}

const save = async () => {
  if (!draftText.value.trim() || isLoading.value) return;

  isLoading.value = true;

  try {
    const config = useRuntimeConfig();
    const token = useCookie('auth_token').value;
    
    await $fetch(`${config.public.apiBase}/api/BecomeAuthor/update-author-bio`, {
      method: 'POST', 
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: {
        authorBio: draftText.value.trim()
      }
    });

    displayedText.value = draftText.value;
    isBlockVisible.value = true; 
    isEditing.value = false;
    isModalOpen.value = false;

  } catch (error) {
    console.error('Помилка при збереженні біографії:', error);
  } finally {
    isLoading.value = false;
  }
}

const cancel = () => {
  isEditing.value = false
  isModalOpen.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.author-profile {
  font-family: 'Montserrat', sans-serif;
}

.main-view {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.open-modal-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 40px; 
  height: 40px;
  padding: 5px; 
  transition: transform 0.2s ease;
}

.open-modal-btn:hover {
  transform: scale(1.1);
}

.display-block {
  background-color: #dfc8d5; 
  padding: 20px 25px;
  border-radius: 12px;
  max-width: 600px;
  text-align: left;
}

.display-title {
  font-size: 22px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  margin-top: 0;
  margin-bottom: 15px;
  color: #000;
}

.display-text {
  font-size: 20px;
  margin: 0;
  color: #000;
  line-height: 1.4;
  white-space: pre-wrap;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #d6b8cc; 
  border: 6px solid #6c4159; 
  border-radius: 18px;
  width: 580px; 
  max-width: 95vw;
  padding: 30px 30px 85px 30px; 
  text-align: center;
  position: relative;
  box-sizing: border-box;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #6c4159;
  margin-top: 0;
  margin-bottom: 25px;
}

.textarea-wrapper {
  position: relative;
  width: 100%;
}

textarea {
  font-family: 'Montserrat', sans-serif; 
  width: 100%;
  height: 220px; 
  background-color: #f2eef0; 
  border: none;
  border-radius: 12px;
  padding: 20px;
  font-size: 20px;
  resize: none;
  box-sizing: border-box;
  outline: none;
  color: #000;
}

textarea[readonly] {
  cursor: default;
}

textarea.is-loading {
  opacity: 0.7;
  cursor: wait;
}

.char-count {
  position: absolute;
  bottom: -25px; 
  right: 5px;
  font-size: 14px;
  color: #000;
}

.btn-primary {
  font-family: 'Montserrat', sans-serif;
  background-color: #5abcb0; 
  color: white;
  border: 4px solid #1a5e55;
  border-radius: 4px;
  padding: 12px 30px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 45px;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: scale(1.03);
}

.action-icons {
  position: absolute;
  bottom: 15px; 
  left: 0;
  width: 100%;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 45px; 
  height: 45px;
  position: absolute;
  bottom: 0;
  transition: transform 0.2s ease;
}

.icon-btn:hover:not(:disabled) {
  transform: scale(1.15);
}

.icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.check-btn {
  left: 20px; 
}

.close-btn {
  right: 20px; 
}
</style>