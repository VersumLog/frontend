<script setup lang="ts">
const isAuthor = ref(true)
const isModalOpen = ref(false)
</script>

<template>
  <div class="min-h-screen">
    <navbar />

    <main class="content-area">
      <slot> </slot>
    </main>

    <button v-if="isAuthor"
      @click="navigateTo('/write/create')"
      class="
        fixed bottom-8 right-8 z-50 
        w-24 h-24 
        rounded-full 
        flex items-center justify-center 
        text-black font-medium 
        shadow-lg
        transition-transform duration-200 hover:scale-105 active:scale-95
        bg-gradient-to-br from-[#fdf5e6]/80 to-[#e5d8c1]/80
        backdrop-blur-sm">писати</button>
        <DraftModal 
      v-if="isModalOpen" 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
    />
  </div>
</template>

<style scoped>
.content-area {
  padding-top: 100px;
  padding-bottom: 50px;
  min-height: 100vh;
}
</style> 