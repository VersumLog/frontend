<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '~/composables/useAuth';
import type { PostGetDto } from '@/types/post';
import PostCard from '@/components/posts/PostCard.vue';

const { token } = useAuth();
const config = useRuntimeConfig();
const errorMessage = ref('');

const posts = ref<PostGetDto[]>([]);
const isLoading = ref(true);
const isLoadingMore = ref(false);
const hasMore = ref(true);
const limit = 20;

// Реф на елемент-тригер у низу сторінки
const observerTarget = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const fetchFeed = async (isInitial = true) => {
  if (!hasMore.value && !isInitial) return;

  if (isInitial) {
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }

  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014';

    const newPosts = await $fetch<PostGetDto[]>(`${baseUrl}/api/feed`, {
      method: 'GET',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      params: {
        limit: limit,
        skip: isInitial ? 0 : posts.value.length
      }
    });

    if (isInitial) {
      posts.value = newPosts;
    } else {
      posts.value.push(...newPosts);
    }

    if (newPosts.length < limit) {
      hasMore.value = false;
    }

  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else if (error.data?.message) {
      errorMessage.value = error.data.message;
    }
    hasMore.value = false;
    console.error('Помилка завантаження стрічки:', error);
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target?.isIntersecting && !isLoading.value && !isLoadingMore.value && hasMore.value) {
        fetchFeed(false);
      }
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: '100px'
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
};

onMounted(() => {
  fetchFeed(true).then(() => {
    setupObserver();
  });
});

onUnmounted(() => {
  if (observer && observerTarget.value) {
    observer.unobserve(observerTarget.value);
    observer.disconnect();
  }
});
</script>

<template>
  <div class="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8 custom-bg">
    <div class="max-w-[1520px] mx-auto">
      <header class="mb-12 text-center">
        <h1 class="text-4xl sm:text-5xl font-black text-main mb-4">Versum</h1>
        <p class="text-muted text-lg">Відкривай для себе нові світи</p>
      </header>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-plum">
        <Icon name="mdi:loading" class="w-16 h-16 animate-spin mb-4" />
        <span class="text-muted font-medium">Завантаження історій...</span>
      </div>

      <div v-else-if="!posts.length" class="text-center py-20">
        <Icon name="mdi:book-open-blank-variant" class="w-24 h-24 mx-auto text-plum-light/50 mb-4" />
        <p class="text-main text-xl font-bold">Стрічка порожня</p>
        <p class="text-muted">Тут поки немає жодного твору.</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
          <PostCard v-for="post in posts" :key="post.postId" :post="post" />
        </div>

        <div ref="observerTarget" class="h-4 w-full mt-8"></div>

        <div v-if="isLoadingMore" class="flex justify-center items-center py-8 text-plum-light">
          <Icon name="mdi:loading" class="w-8 h-8 animate-spin" />
        </div>

        <p v-if="errorMessage" class="error-text text-red-500">{{ errorMessage }}</p>
        <div v-if="!hasMore && posts.length > 0" class="flex flex-col items-center justify-center py-16 mt-8 space-y-6">
          <p class="text-muted italic font-serif">Ви дочитали до самого кінця...</p>

          <div class="flex flex-col items-center pt-8 border-t-2 border-dashed border-plum-light/30">
            <Icon name="mdi:earth" class="w-10 h-10 text-plum mb-3 animate-pulse" />
            <h3 class="text-2xl font-black text-main tracking-widest uppercase">
              Ви докопали до Китаю!
            </h3>
            <p class="text-sm text-plum-light mt-2 font-bold flex items-center">
              <Icon name="mdi:zombie" class="w-5 h-5 mr-1" />
              *Звуки зомбі китайською*
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-bg {
  background-image: radial-gradient(var(--color-plum-light) 0.5px, transparent 0.5px);
  background-size: 40px 40px;
  background-attachment: fixed;
}
</style>