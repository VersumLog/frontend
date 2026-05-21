<script setup lang="ts">
// 
interface Props {
  notification: {
    id: string;
    type: 'Like' | 'Comment' | 'Follower';
    message: string;
    isRead: boolean;
  };
}
const props = defineProps<Props>();
const emit = defineEmits(['read']);

// Динамічний вибір іконки nuxt-icons залежно від типу події [cite: 1]
const iconMap = {
  Like: 'lucide:heart',
  Comment: 'lucide:message-circle',
  Follower: 'lucide:user-plus',
};

const iconColor = computed(() => props.notification.isRead ? 'text-muted' : 'text-plum'); // 
</script>

<template>
  <div 
    @click="emit('read', notification.id)"
    class="flex items-start gap-3 p-3 transition-colors cursor-pointer hover:bg-input-bg rounded-lg"
    :class="{ 'bg-cream-light': !notification.isRead }"
  > 
    <div class="mt-1">
      <Icon :name="iconMap[notification.type]" class="w-5 h-5" :class="iconColor" /> </div>
    <div class="flex-1">
      <p class="text-sm font-medium text-main" :class="{ 'font-bold': !notification.isRead }"> {{ notification.message }}
      </p>
    </div>
    <div v-if="!notification.isRead" class="w-2 h-2 mt-2 rounded-full bg-mint"></div> </div>
</template>