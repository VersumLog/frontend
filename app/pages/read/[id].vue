<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { PostGetDto } from '@/types/post';
import ReadingContent from '@/components/posts/reading/ReadingContent.vue';
import ReadingActions from '@/components/posts/reading/ReadingActions.vue';
import PostLoader from '@/components/posts/PostLoader.vue';
import PostError from '@/components/posts/PostError.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { token } = useAuth();

const postId = route.params.id;

const post = ref<PostGetDto | null>(null);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');

const likesCount = ref<number>(0);
const isLiked = ref<boolean>(false);
const isSaved = ref<boolean>(false);

const fetchPost = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const data = await $fetch<PostGetDto>(`${config.public.apiBase}/api/posts/${postId}`, {
      method: 'GET',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {}, //
    });

    post.value = data;

    // TODO: GET LIKES AND COMMENTS COUNT
    // likesCount.value = data.LikesCount; 
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

const handleToggleLike = async () => {
  isLiked.value ? likesCount.value-- : likesCount.value++;
  isLiked.value = !isLiked.value;

  try {
    await $fetch(`${config.public.apiBase}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {}, //
      body: { isLiked: isLiked.value }
    });
  } catch (error) {
    isLiked.value ? likesCount.value-- : likesCount.value++;
    isLiked.value = !isLiked.value;
  }
};

const handleOpenComments = () => {
  router.push(`/read/${postId}/comments`);
};

const handleToggleSave = async () => {
  isSaved.value = !isSaved.value;

  try {
    await $fetch(`${config.public.apiBase}/api/posts/${postId}/save`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: { isSaved: isSaved.value }
    });
  } catch (error) {
    isSaved.value = !isSaved.value;
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="bg-cream flex flex-col font-sans selection:bg-plum/20">
    <div>
      <div
        class="max-w-4xl mx-auto flex flex-col gap-6 p-6 bg-cream-dark rounded-xl shadow-sm border border-cream-input">
        <PostLoader v-if="isLoading" :postId="postId"/>
        <PostError v-else-if="errorMessage" :errorMessage="errorMessage" @retry="fetchPost" />
        <ReadingContent v-else-if="post" :post="post" />
      </div>
    </div>

    <ReadingActions v-if="post" :likesCount="0" :is-liked="isLiked" :is-saved="isSaved" @toggle-like="handleToggleLike"
      @open-comments="handleOpenComments" @toggle-save="handleToggleSave" />
  </div>
</template>