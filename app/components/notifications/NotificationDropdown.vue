<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useSignalR } from '~/composables/useSignalR';
import NotificationItem from './NotificationItem.vue';

const { notifications, unreadCount, isLoading, markAsRead } = useSignalR();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button 
      @click="toggleDropdown"
      class="flex flex-col items-center relative cursor-pointer no-underline text-white transition-opacity duration-200 hover:opacity-80"
    >
      <Icon name="lucide:bell" class="w-6 h-6 sm:w-7 sm:h-7" />
      
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border border-plum-light"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
      
      <span class="hidden sm:block text-xs font-semibold mt-1.25">Сповіщення</span>
    </button>

    <div 
      v-if="isOpen"
      class="absolute right-0 z-50 w-screen max-w-sm mt-2 overflow-hidden border rounded-lg shadow-lg bg-cream sm:w-80 border-mauve-light sm:right-0 -right-16"
    >
      <div class="p-4 border-b border-mauve-light bg-cream-dark flex justify-between items-center">
        <h3 class="font-semibold text-main">Сповіщення</h3>
        <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin text-muted" />
      </div>

      <div class="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-scroll scrollbar-track-transparent">
        
        <div v-if="notifications.length === 0 && !isLoading" class="p-6 text-center text-muted">
          <Icon name="lucide:bell-off" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">У вас ще немає сповіщень</p>
        </div>

        <div v-else class="flex flex-col p-2">
          <NotificationItem 
            v-for="notif in notifications" 
            :key="notif.id" 
            :notification="notif" 
            @read="markAsRead" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: var(--color-plum-scroll);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-plum-scroll-hover);
}
</style>