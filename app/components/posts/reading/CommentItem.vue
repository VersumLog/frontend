<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '~/composables/useAuth';

const props = defineProps<{
  comment: {
    id: number;
    username: string;
    content: string;
    createdAt: string;
  }
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>();

const { nickname, isLoggedIn } = useAuth();

const isOwner = computed(() => isLoggedIn.value && nickname.value === props.comment.username);
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 p-4 mb-4 rounded-lg bg-cream-dark dark:bg-cream-dark shadow-sm transition-colors">
    <div class="flex-1">
      <div class="flex justify-between items-center mb-2">
        <span class="font-bold text-main">{{ comment.username }}</span>
        <span class="text-sm text-muted">{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
      </div>
      <p class="text-main">{{ comment.content }}</p>
    </div>
    
    <div v-if="isOwner" class="flex justify-end items-start mt-2 md:mt-0">
      <button 
        @click="emit('delete', comment.id)" 
        class="text-mauve hover:text-mauve-dark transition-colors p-2"
        title="Видалити коментар"
      >
        <Icon name="mdi:delete-outline bg-plum" size="24" />
      </button>
    </div>
  </div>
</template>