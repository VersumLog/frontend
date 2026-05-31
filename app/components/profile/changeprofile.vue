<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const route = useRoute()
const { token, nickname } = useAuth()

const isEditModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const errorMessage = ref('')
const isLoadingData = ref(false)

const form = reactive({
  name: '',
  username: '',
  bio: ''
})

const props = defineProps<{
  userData: any
}>()

const emit = defineEmits(['profile-updated'])

const openEditModal = () => {
  isEditModalOpen.value = true
  errorMessage.value = ''

  form.name = props.userData?.name || props.userData?.Name || ''
  form.username = props.userData?.username || props.userData?.Username || ''
  form.bio = props.userData?.bio || props.userData?.Bio || ''
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

// Функція обробки кліку поза межами модального вікна
const handleOverlayClick = () => {
  if (isConfirmModalOpen.value) {
    continueEditing() // Якщо вже відкрито попередження, клік збоку повертає до редагування
  } else {
    openConfirmModal() // Якщо редагуємо, клік збоку викликає попередження
  }
}

const saveProfile = async () => {
  errorMessage.value = ''
  try {
    const newUsername = form.username

    const response = await $fetch<{ message: string, newToken?: string }>(`${config.public.apiBase}/api/Profile/update-profile`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: {
        Username: form.username.toLowerCase(),
        Name: form.name,
        Bio: form.bio
      }
    })

    nickname.value = newUsername

    if (response.newToken) {
      useCookie('auth_token').value = response.newToken
    }

    isEditModalOpen.value = false
    errorMessage.value = ''
    emit('profile-updated')
    if (form.username !== props.userData?.username) {
      await navigateTo(`/profile/${form.username}`)
    }

  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string
    } else {
      errorMessage.value = error.data?.message || "Не вдалося зберегти профіль"
    }
  }
}
</script>

<template>
  <div>
    <button
      class="bg-mauve border-2 border-plum-scroll rounded-full w-[50px] h-[50px] cursor-pointer flex justify-center items-center text-plum-scroll transition-colors duration-200 hover:bg-mauve-light"
      @click="openEditModal">
      <Icon name="ph:gear-six-bold" class="w-6 h-6 hover:rotate-90 transition-transform duration-300" />
    </button>

    <Transition enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in" enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div v-if="isEditModalOpen || isConfirmModalOpen"
        class="fixed inset-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1000]"
        @click.self="handleOverlayClick">

        <Transition mode="out-in" enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-105">

          <div v-if="isEditModalOpen && !isConfirmModalOpen"
            class="bg-mauve border-[3px] border-plum-scroll rounded-lg p-5 shadow-[0_4px_15px_rgba(0,0,0,0.2)] relative font-sans w-[600px] min-h-[250px]">
            <div class="flex gap-[30px]">

              <div class="w-[30%] flex justify-center">
                <div
                  class="w-[120px] h-[120px] bg-input-bg border-2 border-plum-scroll rounded-full flex justify-center items-center relative">
                  <div class="flex justify-center items-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5"
                      stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div
                    class="absolute top-0.5 right-0.5 bg-mauve rounded-full w-[30px] h-[30px] flex justify-center items-center cursor-pointer border border-plum-scroll hover:bg-mauve-light transition-colors">
                    <Icon name="lucide:pencil" class="w-3.5 h-3.5 text-main" />
                  </div>
                </div>
              </div>

              <div class="w-[70%] flex flex-col gap-[15px]">
                <input type="text" v-model="form.username" maxlength="50"
                  @input="form.username = form.username.toLowerCase().replace(/[^a-z0-9_]/g, '')" placeholder="Нікнейм"
                  class="w-full bg-input-bg text-base  border-2 border-transparent p-3 rounded text-main box-border font-sans text-base outline-none transition-all focus:border-mint focus:ring-2 focus:ring-mint/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  :disabled="isLoadingData" />

                <input type="text" v-model="form.name" maxlength="30" placeholder="Ім'я користувача"
                  class="w-full bg-input-bg text-base  border-2 border-transparent p-3 rounded text-main box-border font-sans text-base outline-none transition-all focus:border-mint focus:ring-2 focus:ring-mint/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  :disabled="isLoadingData" />

                <textarea v-model="form.bio" maxlength="200" placeholder="Про мене:"
                  class="w-full  bg-input-bg text-base  border-2 border-transparent p-3 rounded text-main box-border font-sans text-base outline-none transition-all focus:border-mint focus:ring-2 focus:ring-mint/20 resize-none h-[100px] disabled:opacity-70 disabled:cursor-not-allowed"
                  :disabled="isLoadingData"></textarea>

                <p v-if="errorMessage" class="text-red-600 text-[13px] text-center -mt-1 font-bold">{{ errorMessage }}
                </p>
                <p v-if="isLoadingData" class="text-mint-hover text-[13px] text-center -mt-1 italic">Завантаження
                  даних...</p>
              </div>
            </div>

            <div class="flex justify-center mt-20 relative">
              <button
                class=" bg-plum hover:bg-plum-hover text-white border-2 border-mint-dark py-2.5 px-6 text-base cursor-pointer rounded-[24px] font-sans transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                @click="saveProfile" :disabled="isLoadingData">
                Підтвердити
              </button>

              <button
                class="absolute -bottom-2.5 right-0 bg-transparent border-none text-main cursor-pointer p-1 rounded-full hover:bg-plum-light/10 hover:text-plum-hover transition-all disabled:opacity-50"
                @click="openConfirmModal" :disabled="isLoadingData">
                <Icon name="lucide:x" class="w-7 h-7" />
              </button>
            </div>
          </div>

          <div v-else-if="isConfirmModalOpen"
            class="bg-mauve border-[3px] border-plum-scroll rounded-lg p-5 shadow-[0_4px_15px_rgba(0,0,0,0.2)] relative font-sans w-[500px] text-center">
            <div class="flex flex-col items-center pt-5">
              <p class="text-[18px] text-main mb-[30px] font-sans font-medium">Ви впевнені, що хочете скасувати зміни?
              </p>
              <div class="flex gap-5 justify-center">
                <button
                  class="bg-plum hover:bg-plum-hover  text-white border-2 border-mint-dark py-2.5 px-6 text-base cursor-pointer rounded-[24px] font-sans transition-all"
                  @click="cancelChanges">
                  Так
                </button>
                <button
                  class="bg-plum hover:bg-plum-hover  text-white border-2 border-mint-dark py-2.5 px-6 text-base cursor-pointer rounded-[24px] font-sans transition-all"
                  @click="continueEditing">
                  Редагувати далі
                </button>
              </div>
            </div>
          </div>

        </Transition>
      </div>
    </Transition>
  </div>
</template>