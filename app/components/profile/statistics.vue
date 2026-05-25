<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserFollowDto } from '@/types/followers';

const props = defineProps<{
  username: string;
  worksCount: number; // Додано пропс для кількості творів
  followingCount: number;
  followersCount: number;
}>();

const isModalOpen = ref(false)
const modalType = ref<'followers' | 'followings' | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const config = useRuntimeConfig();

const followersList = ref<UserFollowDto[]>([])
const followingsList = ref<UserFollowDto[]>([])

const currentList = computed(() => {
  if (modalType.value === 'followers') return followersList.value;
  if (modalType.value === 'followings') return followingsList.value;
  return [];
})

const openModal = async (type: 'followers' | 'followings') => {
  modalType.value = type
  isModalOpen.value = true
  isLoading.value = true
  errorMessage.value = null

  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014';

    if (type === 'followings') {
      const response = await fetch(`${baseUrl}/api/profile/${props.username}/followings`);
      if (!response.ok) throw new Error('Помилка завантаження підписок');
      followingsList.value = await response.json();
    }
    else if (type === 'followers') {
      const response = await fetch(`${baseUrl}/api/profile/${props.username}/followers`);
      if (!response.ok) throw new Error('Помилка завантаження підписників');
      followersList.value = await response.json();
    }
  } catch (error: any) {
    console.error('Помилка API:', error);
    errorMessage.value = error.message || 'Сталася помилка при завантаженні даних';
  } finally {
    isLoading.value = false;
  }
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    modalType.value = null
  }, 300)
}
</script>

<template>
  <div class="font-['Montserrat'] relative w-full">
    <div class="flex flex-wrap items-center gap-8 text-xl font-bold text-muted">

      <button @click="openModal('followings')"
        class="relative z-[1] flex cursor-pointer items-center gap-2 p-1 border-none rounded-xl bg-cream-dark p-0 transition-opacity hover:opacity-70 focus:outline-none">
        <span>Підписок</span>
        <span class="text-muted">{{ followingCount }}</span>
      </button>

      <button @click="openModal('followers')"
        class="relative z-[1] flex cursor-pointer items-center gap-2 p-1 border-none rounded-xl bg-cream-dark p-0 transition-opacity hover:opacity-70 focus:outline-none">
        <span>Підписників</span>
        <span class="text-muted">{{ followersCount }}</span>
      </button>

      <div class="relative z-[1] flex items-center gap-2">
        <span>Творів</span>
        <span class="text-muted">{{ worksCount }}</span>
      </div>

    </div>

    <ClientOnly>
      <Teleport to="body">
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
          enter-to-class="opacity-100" leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-if="isModalOpen"
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="closeModal">
            <Transition enter-active-class="transition duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)"
              enter-from-class="scale-95 opacity-0" enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-300 ease-in" leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0">
              <div
                class="relative w-full max-w-sm overflow-hidden rounded-2xl border-4 border-plum-light bg-mauve shadow-2xl">

                <button @click="closeModal"
                  class="absolute right-4 top-4 z-10 cursor-pointer border-none bg-transparent text-plum-light transition-transform hover:scale-110 focus:outline-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </button>

                <div class="custom-scrollbar max-h-[70vh] overflow-y-auto p-6">
                  <div class="mb-6 pt-2 text-center">
                    <h3 class="text-xl font-bold text-plum-light">
                      {{ modalType === 'followers' ? 'Ваші підписники' : 'Ваші підписки' }}
                    </h3>
                  </div>

                  <div class="space-y-3">

                    <div v-for="item in currentList" :key="item.username">
                      <NuxtLink
                        class="flex items-center gap-4 rounded-xl border border-plum-light bg-white/30 p-3 transition-colors hover:bg-white/50"
                        :to="`/profile/${item.username}`">
                        <div
                          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-plum-light text-white">

                          <span class="font-bold">
                            {{ (item.displayName || item.username).charAt(0).toUpperCase() }}
                          </span>
                        </div>

                        <div class="flex flex-col">
                          <span class="text-[1.1rem] font-medium text-muted line-clamp-1 leading-tight">
                            {{ item.displayName || item.username }}
                          </span>
                          <span v-if="item.displayName" class="text-sm text-muted/70">
                            @{{ item.username }}
                          </span>
                        </div>
                      </NuxtLink>
                    </div>

                    <div v-if="isLoading" class="py-6 text-center font-medium text-plum-light/60">
                      Завантаження...
                    </div>

                    <div v-else-if="errorMessage" class="py-6 text-center font-medium text-red-500">
                      {{ errorMessage }}
                    </div>

                    <div v-else-if="currentList.length === 0" class="py-6 text-center font-medium text-plum-light/60">
                      Список порожній.
                    </div>
                  </div>

                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
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