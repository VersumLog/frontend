<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  username: string
  initialIsFollowing?: boolean
}>()

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
    const token = useCookie('auth_token').value

    await $fetch<any>(`${config.public.apiBase}/api/Profile/follow/${props.username}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
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
  <div class="group inline-block">
    <button 
      class="relative flex items-center justify-center bg-[#72485E] text-black border border-black rounded-full cursor-pointer shadow-md transition-all hover:bg-[#5c3a4b] active:scale-95 w-[60px] h-[60px] md:w-[70px] md:h-[70px] disabled:opacity-50 disabled:cursor-not-allowed" 
      @click="toggleFollow"
      :disabled="isLoading"
      :aria-label="isFollowing ? 'Відписатись' : 'Підписатись'"
    >
      
      <svg 
        class="w-10 h-10 md:w-11 md:h-11 transition-transform duration-200" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          :d="isFollowing ? 'M5 12H19' : 'M12 5V19M5 12H19'" 
          stroke="white" 
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </svg>

      <span 
        class="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#FDE9D1] text-[#04151F] text-sm md:text-base font-bold font-sans rounded-xl border-2 border-[#72485E] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20"
      >
        {{ isFollowing ? 'Відписатись' : 'Підписатись' }}
        
        <span class="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FDE9D1] border-b-2 border-r-2 border-[#72485E] rotate-45"></span>
      </span>
      
    </button>
  </div>
</template>