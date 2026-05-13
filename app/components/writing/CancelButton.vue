<script setup lang="ts">
const isOpen = defineModel<boolean>()

const confirmCancel = () => {
  isOpen.value = false
  navigateTo('/')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="isOpen = false"></div>

      <div class="relative w-full max-w-md p-8 text-center bg-[#C2B280] rounded-2xl shadow-2xl">
        <h3 class="text-white text-xl font-medium mb-8">
          Ви впевнені, що хочете скасувати зміни?
        </h3>
        
        <div class="flex justify-center gap-4">
          <button 
            @click="confirmCancel"
            class="px-8 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            Так
          </button>
          
          <button 
            @click="isOpen = false"
            class="px-8 py-2 bg-white text-[#C2B280] rounded-lg font-bold shadow-md hover:bg-gray-50 transition-colors"
          >
            Редагувати далі
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>