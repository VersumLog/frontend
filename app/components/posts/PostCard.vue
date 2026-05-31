<script setup lang="ts">
import type { PostGetDto } from '@/types/post';

const props = defineProps<{
  post: PostGetDto;
}>();

const goToReadPage = () => {
  navigateTo(`/read/${props.post.postId}`);
};
</script>

<template>
  <div 
    @click="goToReadPage"
    class="group relative flex flex-col bg-cream-dark border-2 border-plum-light rounded-[2rem] p-8 sm:p-10 hover:border-plum hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl h-full overflow-hidden"
  >
    <div class="absolute top-0 right-0 w-36 h-32 bg-plum-light rounded-bl-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-700 ease-out"></div>

    <header class="mb-6 relative z-10">
      <div class="flex items-center justify-between mb-6">
        <span class="text-sm font-black uppercase tracking-widest text-plum flex items-center bg-plum-light px-4 py-2 rounded-full">
          <Icon name="mdi:account-edit" class="w-5 h-5 mr-2" />
          @{{ post.username }}
        </span>
        <time class="text-sm text-muted font-bold tracking-wide">
          {{ new Date(post.createdAt).toLocaleDateString('uk-UA') }}
        </time>
      </div>
      
      <h3 class="text-3xl sm:text-4xl font-black text-main italic leading-tight group-hover:text-plum transition-colors duration-300 mb-4">
        {{ post.title }}
      </h3>
      
      <div v-if="post.genres?.length" class="flex flex-wrap gap-2 mt-4">
        <span 
          v-for="genre in post.genres" 
          :key="genre" 
          class="text-xs font-bold uppercase tracking-widest text-muted border border-muted px-3 py-1.5 rounded-lg bg-cream-dark"
        >
          {{ genre }}
        </span>
      </div>
    </header>

    <div class="flex-grow relative z-10 mt-2">
      <p class="text-lg sm:text-xl text-main leading-relaxed font-serif line-clamp-4">
        {{ post.description }}
      </p>
    </div>

    <footer class="mt-10 flex items-center justify-between text-base font-bold text-plum group-hover:text-plum-hover transition-colors pt-6 border-t border-plum-light relative z-10">
      <span class="flex items-center">
        <Icon name="mdi:book-open-page-variant" class="w-6 h-6 mr-2" />
        Почати читання
      </span>
      <Icon name="mdi:arrow-right" class="w-6 h-6 transform group-hover:translate-x-3 transition-transform duration-300" />
    </footer>
  </div>
</template>
