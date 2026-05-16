<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

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
      
      <!-- 1. СТАН ЗАВАНТАЖЕННЯ (isLoading замість pending) -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-cream rounded-[40px]">
        <div class="relative flex items-center justify-center">
          <div class="absolute animate-ping h-20 w-20 rounded-full bg-plum-light opacity-10"></div>
          <div class="relative rounded-full h-14 w-14 border-4 border-plum border-t-[var(--color-plum-light)] animate-spin"></div>
          <span class="absolute text-xl animate-spin">
            <Icon name="tabler:file-search" class="w-12 h-12 text-plum" />
          </span>
        </div>

        <div class="text-center space-y-3">
          <h3 class="text-2xl font-black text-plum tracking-tight animate-pulse">
            Шукаємо твір...
          </h3>
          <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-plum-light/5 border border-plum-light/10">
            <span class="text-plum font-semibold text-sm">
              ID запису: <span class="font-mono">#{{ postId }}</span>
            </span>
          </div>
        </div>
    
        <div class="flex gap-2">
          <div class="h-2 w-2 rounded-full bg-plum animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-2 w-2 rounded-full bg-plum animate-bounce [animation-delay:-0.15s]"></div>
          <div class="h-2 w-2 rounded-full bg-plum animate-bounce"></div>
        </div>
      </div>

      <!-- 2. СТАН ПОМИЛКИ (перевіряємо errorMessage) -->
      <div v-else-if="errorMessage" class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div class="bg-white/50 p-12 rounded-[40px] border-2 border-dashed border-plum-light/20 max-w-lg w-full">
          <span class="text-6xl mb-6 block">📑</span>
          
          <h2 class="text-3xl font-black text-plum-light mb-2">Сталася помилка</h2>
          <p class="text-plum-light/70 mb-8">
            {{ errorMessage }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="fetchPost" 
              class="bg-plum-light text-white px-8 py-4 rounded-2xl font-bold hover:bg-plum-scroll-hover transition-all shadow-lg">
              Спробувати ще раз
            </button>
            <button @click="navigateTo('/')" 
              class="bg-transparent border-2 border-plum-light text-plum-light px-8 py-4 rounded-2xl font-bold hover:bg-plum-light/5 transition-all">
              На головну
            </button>
          </div>
        </div>
      </div>

      <!-- 3. ФОРМА РЕДАГУВАННЯ (коли post завантажено) -->
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