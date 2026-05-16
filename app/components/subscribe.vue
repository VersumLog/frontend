<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  username: string
  initialIsFollowing?: boolean
}>()

const { token, nickname } = useAuth();

const emit = defineEmits(['update-follow'])

const isFollowing = ref(props.initialIsFollowing ?? false)
const isLoading = ref(false)
watch(() => props.initialIsFollowing, (newVal) => {
  if (newVal !== undefined) {
    isFollowing.value = newVal
  }
})

const toggleFollow = async () => {
  if (isLoading.value) return

  isFollowing.value = !isFollowing.value
  emit('update-follow', isFollowing.value)

  isLoading.value = true

  try {
    const config = useRuntimeConfig()
    await $fetch<any>(`${config.public.apiBase}/api/Profile/follow/${props.username}`, {
      method: 'POST',
      headers: {
        'Authorization': token.value ? `Bearer ${token.value}` : ''
      }
    })


  } catch (error: any) {
    console.error('Помилка при зміні статусу підписки:', error)

    isFollowing.value = !isFollowing.value
    emit('update-follow', isFollowing.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <button
      class="relative flex items-center justify-center bg-plum-light text-white border border-black/10 rounded-full cursor-pointer shadow-md transition-all hover:bg-plum-scroll-hover active:scale-95 w-[50px] h-[50px] md:w-[60px] md:h-[60px] disabled:opacity-50 disabled:cursor-not-allowed z-10"
      @click="toggleFollow" :disabled="isLoading" :aria-label="isFollowing ? 'Відписатись' : 'Підписатись'">
      <Icon :name="isFollowing ? 'lucide:user-minus' : 'lucide:user-plus'"
        class="w-7 h-7 md:w-8 md:h-8 transition-transform duration-200" />

      <span
        class="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-cream text-main text-sm md:text-base font-bold font-sans rounded-xl border-2 border-plum-light shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-top-14 pointer-events-none whitespace-nowrap z-50">
        {{ isFollowing ? 'Відписатись' : 'Підписатись' }}

        <span
          class="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cream border-b-2 border-r-2 border-plum-light rotate-45"></span>
      </span>
    </button>
  </div>
</template>