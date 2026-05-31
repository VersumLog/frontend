
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  username: string,
  isOwner?: boolean 
}>(), {
  isOwner: true 
})
const { token, nickname } = useAuth();

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
    await $fetch(`${config.public.apiBase}/api/BecomeAuthor/update-author-bio`, {
      method: 'POST',
      headers: { 'Authorization': token.value ? `Bearer ${token.value}` : '', 'Content-Type': 'application/json' },
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


<template>
  <div class="font-['Montserrat'] relative w-full">
    
    <button 
      v-if="displayedText || isOwner" 
      class="absolute -right-4 bottom-2 z-10 h-16 w-16 cursor-pointer border-none bg-transparent transition-transform duration-200 hover:scale-110 focus:outline-none"
      @click="openModal"
    >
      <img src="@/assets/pen.png" alt="Edit" class="h-full w-full object-contain" />
    </button>

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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" 
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
          <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border-4 border-plum-light bg-mauve shadow-2xl">
            
            <div class="custom-scrollbar max-h-[85vh] overflow-y-auto p-6">
              
              <div class="mb-6 pt-2 text-center">
                <h3 class="text-xl font-light text-plum-light">
                  {{ isOwner ? 'Редагування біографії' : 'Інформація про автора' }}
                </h3>
              </div>

              <div v-if="!isEditing" class="mt-2">
                <div v-if="displayedText" class="rounded-[1.25rem] border border-plum-light/40 bg-white/15 p-6 shadow-sm">
                  <h4 class="mb-4 text-left text-xl font-bold text-black underline decoration-2 underline-offset-4">
                    Чому я став автором?
                  </h4>
                  
                  <p class="whitespace-pre-wrap break-words text-left text-[1.1rem] font-medium leading-relaxed text-black">
                    {{ displayedText }}
                  </p>
                </div>
                
                <div v-else class="py-6 text-center font-medium text-plum-light/60">
                  Біографія ще не заповнена.
                </div>

                <button 
                  v-if="isOwner" 
                  @click="startEditing"
                  class="mt-6 w-full rounded-xl border-[3px] border-mint-dark bg-mint-hover p-3 text-[1.1rem] font-bold text-white transition-colors hover:bg-mint-hover"
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
                    class="min-h-[250px] w-full resize-none rounded-2xl border-none bg-cream-input p-5 text-base shadow-inner outline-none focus:ring-2 focus:ring-plum-light/20"
                    :disabled="isLoading"
                  ></textarea>
                  
                  <div class="mt-1 text-right text-xs font-semibold text-plum-light">
                    {{ draftText.length }}/500
                  </div>
                </div>

                <p v-if="errorMessage" class="text-center text-sm font-bold text-red-600">{{ errorMessage }}</p>

                <div class="flex justify-between items-center px-10 pt-2">
                  <button 
                    @click="saveBio" 
                    :disabled="isLoading || !draftText.trim()" 
                    class="cursor-pointer border-none bg-transparent transition-transform hover:scale-110 disabled:opacity-30"
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12L9 17L20 6" stroke="var(--color-plum-light)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  <button 
                    @click="cancelEditing" 
                    :disabled="isLoading" 
                    class="cursor-pointer border-none bg-transparent transition-transform hover:scale-110 disabled:opacity-30"
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L18 18M6 18L18 6" stroke="var(--color-plum-light)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-plum-light);
  border-radius: 10px;
}
</style>