<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import CommentItem from '~/components/posts/reading/CommentItem.vue';
import CommentForm from '~/components/posts/reading/CommentForm.vue';

const route = useRoute();
const config = useRuntimeConfig();
const { token } = useAuth();

const postId = route.params.id as string;
const comments = ref<any[]>([]);
const isLoading = ref(true);

const fetchComments = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/api/posts/${postId}/comments`, {
      method: 'GET',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {}
    });
    comments.value = data || [];
  } catch (error) {
    console.error('Помилка завантаження коментарів:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteComment = async (commentId: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цей коментар?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/api/posts/comments/${commentId}/delete`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {}
    });
    comments.value = comments.value.filter(c => c.id !== commentId);
  } catch (error) {
    console.error('Помилка видалення коментаря:', error);
  }
};

onMounted(() => {
    fetchComments();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 w-full">
    <h2 class="text-2xl font-bold text-main mb-6 flex items-center gap-2">
      <Icon name="mdi:comment-multiple-outline" class="text-plum" />
      Коментарі
    </h2>
    
    <div v-if="isLoading" class="flex justify-center py-10">
      <Icon name="mdi:loading" size="40" class="animate-spin text-mint" />
    </div>
    
    <div v-else-if="comments.length > 0" class="flex flex-col gap-2">
      <CommentItem 
        v-for="comment in comments" 
        :key="comment.id" 
        :comment="comment" 
        @delete="handleDeleteComment" 
      />
    </div>
    
    <div v-else class="text-center py-10 bg-cream-light dark:bg-cream-dark rounded-xl border border-dashed border-muted">
      <Icon name="mdi:comment-remove-outline" size="48" class="text-muted mb-2" />
      <p class="text-muted">Ще немає коментарів. Будьте першим!</p>
    </div>

    <CommentForm :postId="postId" @commentAdded="fetchComments" />
  </div>
</template>