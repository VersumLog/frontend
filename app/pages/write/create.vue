<script setup lang="ts">
import DraftModal from '~/components/posts/writing/DraftModal.vue';
const isModalOpen = ref(false)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
    <h1 class="text-3xl font-serif font-bold text-main mb-4 italic">
      Ваша творчість починається тут
    </h1>
    
    <p class="text-muted mb-10 max-w-md leading-relaxed">
      Кожна велика історія починається з першого слова. Натисніть кнопку нижче, щоб дати назву вашому новому твору.
    </p>

    <button 
      @click="isModalOpen = true"
      class="px-10 py-4 bg-cream-dark text-white font-bold rounded-full shadow-lg hover:bg-cream-dark transition-all duration-300 transform hover:scale-105 active:scale-95"
    >
      Почати писати
    </button>

    <DraftModal 
      v-if="isModalOpen" 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
    />
  </div>
</template>

<style scoped>
</style>