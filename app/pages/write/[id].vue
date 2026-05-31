<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import WritingForm from '@/components/posts/writing/WritingForm.vue';
import PostLoader from '@/components/posts/PostLoader.vue';
import PostError from '@/components/posts/PostError.vue';

const config = useRuntimeConfig();
const { token } = useAuth();
const route = useRoute();
const postId = route.params.id as string;

const post = ref<any>(null);
const isLoading = ref(false);
const errorMessage = ref('');

const fetchPost = async () => {
  isLoading.value = true;
  errorMessage.value = ''; 

  try {
    const data = await $fetch<any>(`${config.public.apiBase}/api/posts/${postId}`, {
      method: 'GET',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
    });
    
    post.value = data;
  } catch (error: any) {
    console.error('Помилка завантаження поста:', error);
    
    const errorData = error.data;
    if (errorData?.errors) {
      errorMessage.value = Object.values(errorData.errors).flat()[0] as string;
    } else {
      errorMessage.value = errorData?.message || "Не вдалося завантажити пост";
    }
    
    post.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="profile-container">
      
      <PostLoader v-if="isLoading" :postId="postId" />

      <PostError v-else-if="errorMessage" :errorMessage="errorMessage" @retry="fetchPost" />

      <WritingForm 
        v-else-if="post"
        :postId="postId" 
        :initialTitle="post.title"
        :initialDescription="post.description"
        :initialContent="post.content"
      />

    </div>
  </div>
</template>