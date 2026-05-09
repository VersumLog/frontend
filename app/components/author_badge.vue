<template>
  <div class="author-bio-wrapper relative w-full">
    
    <button v-if="displayedText || isOwner" class="open-modal-btn" @click="openModal">
      <img src="./pen.png" alt="Edit" style="width: 100%; height: 100%; object-fit: contain;" />
    </button>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closeModal">
        <Transition name="scale">
          
          <div class="modal-card bg-[#E5C5D5] border-4 border-[#744458] rounded-2xl w-full max-w-lg overflow-hidden relative">
            
            <div class="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              
              <div class="text-center pt-2 mb-6">
                <h3 class="modal-title text-xl font-light text-[#744458]">
                  {{ isOwner ? 'Редагування біографії' : 'Інформація про автора' }}
                </h3>
              </div>

              <div v-if="!isEditing" class="mt-2">
                
                <div v-if="displayedText" class="bio-display-box shadow-sm">
                  <h4 class="bio-section-title">
                    Чому я став автором?
                  </h4>
                  
                  <p class="bio-content-text">
                    {{ displayedText }}
                  </p>
                </div>
                
                <div v-else class="text-center py-6 text-[#744458]/60 font-medium">
                  Біографія ще не заповнена.
                </div>

                <button 
                  v-if="isOwner" 
                  @click="startEditing"
                  class="edit-action-btn mt-6"
                >
                  Редагувати
                </button>
              </div>

              <div v-else-if="isOwner" class="mt-2 space-y-4">
                <div class="relative">
                  <textarea
                    v-model="draftText"
                    maxlength="500"
                    placeholder="Напишіть свою історію..."
                    class="bio-textarea shadow-inner"
                    :disabled="isLoading"
                  ></textarea>
                  
                  <div class="char-counter">
                    {{ draftText.length }}/500
                  </div>
                </div>

                <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

                <div class="flex justify-between items-center px-10 pt-2">
                  <button @click="saveBio" :disabled="isLoading || !draftText.trim()" class="icon-btn hover:scale-110 disabled:opacity-30">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12L9 17L20 6" stroke="#744458" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  <button @click="cancelEditing" :disabled="isLoading" class="icon-btn hover:scale-110 disabled:opacity-30">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L18 18M6 18L18 6" stroke="#744458" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  username: string,
  isOwner?: boolean 
}>(), {
  isOwner: true 
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const displayedText = ref('') 
const draftText = ref('')    

onMounted(async () => {
  await fetchBio()
})

const fetchBio = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await $fetch<any>(`${config.public.apiBase}/api/BecomeAuthor/${props.username}/author-bio`);
    if (response && response.bio) {
      displayedText.value = response.bio;
    }
  } catch (error) {
    console.error('Помилка завантаження');
  }
}

const openModal = () => {
  draftText.value = displayedText.value
  isModalOpen.value = true
  isEditing.value = !displayedText.value && props.isOwner
}

const closeModal = () => {
  if (isLoading.value) return
  isModalOpen.value = false
  isEditing.value = false
  errorMessage.value = ''
}

const startEditing = () => { isEditing.value = true }

const cancelEditing = () => {
  if (!displayedText.value) closeModal();
  else {
    isEditing.value = false
    draftText.value = displayedText.value
    errorMessage.value = ''
  }
}

const saveBio = async () => {
  if (!draftText.value.trim() || isLoading.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const config = useRuntimeConfig();
    const token = useCookie('auth_token').value;
    await $fetch(`${config.public.apiBase}/api/BecomeAuthor/update-author-bio`, {
      method: 'POST',
      headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
      body: { AuthorBio: draftText.value.trim() }
    });
    displayedText.value = draftText.value;
    isEditing.value = false;
  } catch (error: any) {
    errorMessage.value = error.data?.message || "Не вдалося зберегти";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.author-bio-wrapper, .modal-card, .modal-title, .bio-textarea, .edit-action-btn {
  font-family: 'Montserrat', sans-serif !important;
}

.open-modal-btn {
  position: absolute;
  
  bottom: 0.5rem;
  right: -1rem;
  
  width: 4rem;     
  height: 4rem;    
  background: transparent;
  border: none;    
  z-index: 10;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.open-modal-btn:hover {
  transform: scale(1.1); 
}
.bio-display-box {
  border: 1.5px solid rgba(116, 68, 88, 0.4); 
  border-radius: 1.25rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.15);
}

.bio-section-title {
  text-align: left;
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  text-decoration: underline;
  text-underline-offset: 4px;
  margin-bottom: 1rem;
}

.bio-content-text {
  text-align: left;
  font-size: 1.1rem;
  font-weight: 500;
  color: #000;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.edit-action-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #52AFA0;
  border: 3px solid #184E45;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 0.75rem;
  cursor: pointer;
}

.bio-textarea {
  width: 100%;
  min-height: 250px;
  padding: 1.25rem;
  background-color: #F3EDF0;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  outline: none;
  resize: none;
}

.char-counter {
  text-align: right;
  font-size: 0.75rem;
  color: #744458;
  font-weight: 600;
}

.icon-btn { background: transparent; border: none; cursor: pointer; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #744458; border-radius: 10px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-enter-active, .scale-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from, .scale-leave-to { transform: scale(0.95); opacity: 0; }
</style>