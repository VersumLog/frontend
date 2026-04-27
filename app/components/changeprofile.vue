<template>
  <div>
    <button class="open-settings-btn" @click="openEditModal">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </button>

    <Transition name="fade">
      <div v-if="isEditModalOpen || isConfirmModalOpen" class="modal-overlay">
        <Transition name="scale" mode="out-in">
          
          <div v-if="isEditModalOpen && !isConfirmModalOpen" class="modal edit-modal">
            <div class="modal-body">
              <div class="avatar-section">
                <div class="avatar-placeholder">
                  <div class="avatar-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div class="edit-avatar-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <input 
                  type="text" 
                  v-model="form.username" 
                  maxlength="50"
                  @input="form.username = form.username.toLowerCase().replace(/[^a-z0-9_]/g, '')"
                  placeholder="Нікнейм" 
                  class="custom-input" 
                />
                
                <input 
                  type="text" 
                  v-model="form.name" 
                  maxlength="30"
                  placeholder="Ім'я користувача" 
                  class="custom-input" 
                />
                
                <textarea 
                  v-model="form.bio" 
                  maxlength="200"
                  placeholder="Про мене:" 
                  class="custom-textarea"
                ></textarea>
                
                <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-primary confirm-btn" @click="saveProfile">Підтвердити</button>
              <button class="close-btn" @click="openConfirmModal">&times;</button>
            </div>
          </div>

          <div v-else-if="isConfirmModalOpen" class="modal confirm-modal">
            <div class="modal-body confirm-body">
              <p class="confirm-text">Ви впевнені, що хочете скасувати зміни?</p>
              <div class="confirm-actions">
                <button class="btn-primary" @click="cancelChanges">Так</button>
                <button class="btn-primary" @click="continueEditing">Редагувати далі</button>
              </div>
            </div>
          </div>

        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const props = defineProps<{
  initialData?: {
    name: string;
    username: string;
    bio: string;
  }
}>()

const config = useRuntimeConfig()

const isEditModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',      
  username: '',  
  bio: ''        
})

const openEditModal = () => {
  if (props.initialData) {
    form.name = props.initialData.name || ''
    form.username = props.initialData.username || ''
    form.bio = props.initialData.bio || ''
  }
  isEditModalOpen.value = true
}

const openConfirmModal = () => {
  isConfirmModalOpen.value = true
}

const continueEditing = () => {
  isConfirmModalOpen.value = false
}

const cancelChanges = () => {
  isConfirmModalOpen.value = false
  isEditModalOpen.value = false
  errorMessage.value = ''
  form.name = ''
  form.username = ''
  form.bio = ''
}

const saveProfile = async () => {
  errorMessage.value = ''
  
  try {
    const token = useCookie('auth_token').value; 

    const response = await $fetch<{ message: string }>(`${config.public.apiBase}/api/Profile/update-profile`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: {
        Username: form.username,
        Name: form.name,
        Bio: form.bio
      }
    })

    console.log('Успіх:', response.message)
    isEditModalOpen.value = false
    errorMessage.value = ''

  } catch (error: any) {
    console.error("Помилка збереження:", error)
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string
    } else {
      errorMessage.value = error.data?.message || "Не вдалося зберегти профіль"
    }
  }
}
</script>

<style scoped>
.open-settings-btn {
  background: #E4C1D3;
  border: 2px solid #7E4864;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7E4864;
  transition: background-color 0.2s;
}

.open-settings-btn:hover {
  background: #CCA8BA;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #E4C1D3;
  border: 3px solid #7E4864;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  position: relative;
}

.edit-modal {
  width: 600px;
  min-height: 250px; 
}

.modal-body {
  display: flex;
  gap: 30px;
}

.avatar-section {
  width: 30%;
  display: flex;
  justify-content: center;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  background-color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.edit-avatar-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #CCA8BA;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #7E4864;
}

.form-section {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.custom-input, .custom-textarea {
  width: 100%;
  background-color: #F3EDF0;
  border: none;
  padding: 12px;
  border-radius: 4px;
  color: #000000;
  font-family: inherit;
  box-sizing: border-box;
}

.custom-textarea {
  resize: none;
  height: 100px;
}

.error-text {
  color: #c9302c;
  font-size: 13px;
  text-align: center;
  margin-top: -5px;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  position: relative;
}

.btn-primary {
  background-color: #52AFA0;
  color: #FFFFFF;
  border: 2px solid #184E45;
  padding: 10px 25px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

.close-btn {
  position: absolute;
  bottom: -10px;
  right: 0;
  background: transparent;
  border: none;
  font-size: 32px;
  color: #000000;
  cursor: pointer;
}

.confirm-modal {
  width: 500px;
  text-align: center;
}

.confirm-body {
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.confirm-text {
  font-size: 18px;
  color: #000000;
  margin-bottom: 30px;
}

.confirm-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-enter-active, .scale-leave-active { transition: all 0.3s ease; }
.scale-enter-from { opacity: 0; transform: scale(0.95); }
.scale-leave-to { opacity: 0; transform: scale(1.05); }
</style>