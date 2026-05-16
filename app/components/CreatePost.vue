<script setup lang="ts">
import { ref } from 'vue';
const isModalOpen = ref(false);
</script>

<template>
    <button 
      @click="navigateTo('/write/create')"
      class="
      fixed bottom-8 right-8 z-50 
      w-24 h-24 rounded-full 
      flex items-center justify-center 
      text-main font-bold uppercase text-sm tracking-wider
      bg-cream-light
      border-2 border-muted
      shadow-[0_4px_12px_rgba(74,52,62,0.3)]
      transition-all duration-200 
      hover:scale-105 hover:bg-cream-dark 
      active:scale-95
      ">
      писати
    </button>
  
    <DraftModal 
      v-if="isModalOpen" 
      :is-open="isModalOpen" 
      @close="isModalOpen = false"
    />
  </template>