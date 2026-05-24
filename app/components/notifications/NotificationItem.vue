<script setup lang="ts">
import type { Notification } from '~/composables/useSignalR';

const props = defineProps<{
  notification: Notification
}>();

const emit = defineEmits<{
  (e: 'read', id: number): void
}>();

// Форматування дати
const formattedDate = computed(() => {
  const date = new Date(props.notification.createdAt);
  return date.toLocaleDateString('uk-UA', { 
    hour: '2-digit', 
    minute: '2-digit', 
    day: '2-digit', 
    month: 'short' 
  });
});
</script>

<template>
  <div 
    @click="emit('read', notification.id)"
    class="flex items-start gap-3 p-3 transition-colors duration-200 cursor-pointer rounded-md"
    :class="notification.isRead ? 'bg-transparent hover:bg-mauve-light/20' : 'bg-plum-light/10 hover:bg-plum-light/20'"
  >
    <div class="flex-shrink-0 mt-1">
      <Icon v-if="notification.type === 'Follower'" name="lucide:user-plus" class="w-5 h-5 text-plum" />
      <Icon v-else-if="notification.type === 'Like'" name="lucide:heart" class="w-5 h-5 text-red-500" />
      <Icon v-else name="lucide:bell" class="w-5 h-5 text-main" />
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm text-main" :class="{ 'font-semibold': !notification.isRead }">
        {{ notification.message }}
      </p>
      <p class="text-xs text-muted mt-1">
        {{ formattedDate }}
      </p>
    </div>

    <div v-if="!notification.isRead" class="flex-shrink-0 mt-2">
      <div class="w-2 h-2 rounded-full bg-plum"></div>
    </div>
  </div>
</template>