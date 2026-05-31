<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

const route = useRoute();
const props = defineProps<{ postId: string }>();
const emit = defineEmits<{
  (e: 'commentAdded'): void
}>();

const { token, isLoggedIn } = useAuth();
const commentText = ref('');
const isSubmitting = ref(false);
const config = useRuntimeConfig();
const postId = route.params.id as string;

const submitComment = async () => {
  if (!commentText.value.trim() || !isLoggedIn.value) return;

  isSubmitting.value = true;
  try {
    // Використовуємо структуру запиту з твого прикладу
    await $fetch(`${config.public.apiBase}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: {
        Content: commentText.value
      }
    });
    
    commentText.value = '';
    emit('commentAdded'); // Оновлюємо список коментарів
  } catch (error) {
    console.error('Помилка при додаванні коментаря:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="mt-6 p-4 bg-cream-dark rounded-xl">
    <h3 class="text-lg font-bold text-main mb-3">Залишити коментар</h3>
    
    <div v-if="!isLoggedIn" class="p-4 bg-mint-light text-mint-dark rounded-lg flex items-center gap-2">
      <Icon name="mdi:information-outline" size="20" />
      <span>Будь ласка, увійдіть у систему, щоб залишити коментар.</span>
    </div>
    
    <form v-else @submit.prevent="submitComment" class="flex flex-col gap-3">
      <textarea
        v-model="commentText"
        rows="3"
        placeholder="Напишіть щось..."
        class="w-full p-3 rounded-lg bg-input-bg text-main border border-muted focus:outline-none focus:border-plum transition-colors resize-none"
        required
      ></textarea>
      <div class="flex justify-end">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="px-6 py-2 bg-plum text-cream rounded-lg hover:bg-plum-hover disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin" />
          <Icon v-else name="mdi:send" />
          <span>Відправити</span>
        </button>
      </div>
    </form>
  </div>
</template>