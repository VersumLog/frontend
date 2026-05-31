<script setup lang="ts">
import type { PostGetDto } from '@/types/post';

const props = defineProps<{
  post: PostGetDto;
}>();

const emit = defineEmits<{
  (e: 'unsave', postId: number): void;
}>();

const goToReadPage = () => {
  navigateTo(`/read/${props.post.postId}`);
};

const handleUnsave = (event: Event) => {
  event.stopPropagation();
  emit('unsave', props.post.postId);
};
</script>

<template>
  <article 
    @click="goToReadPage"
    class="group relative flex flex-col bg-cream-dark border-2 border-plum-light rounded-[2rem] p-6 sm:p-8 hover:border-plum hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl h-full overflow-hidden"
  >
    <div class="absolute top-0 right-0 w-32 h-28 bg-plum-light rounded-bl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700 ease-out"></div>

    <header class="mb-4 relative z-10">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs sm:text-sm font-black uppercase tracking-widest text-plum flex items-center bg-cream-light px-3 py-1.5 rounded-full border border-plum-light">
          <Icon name="mdi:account-edit" class="w-4 h-4 mr-2" />
          @{{ post.username }}
        </span>
        
        <button 
          @click="handleUnsave"
          class="bg-cream-light border-2 border-plum-light rounded-full p-2 text-plum hover:bg-plum hover:text-cream transition-colors z-20"
          title="Видалити зі збережених"
        >
          <Icon name="mdi:bookmark-remove" class="w-5 h-5" />
        </button>
      </div>
      
      <h3 class="text-2xl sm:text-3xl font-black text-main italic leading-tight group-hover:text-plum transition-colors duration-300 mb-3">
        {{ post.title }}
      </h3>
    </header>

    <div class="flex-grow relative z-10">
      <p class="text-base sm:text-lg text-muted leading-relaxed font-serif line-clamp-3">
        {{ post.description }}
      </p>
    </div>

    <footer class="mt-6 flex items-center justify-between text-sm font-bold text-plum-dark group-hover:text-plum-hover transition-colors pt-4 border-t border-plum-light relative z-10">
      <span class="flex items-center">
        <Icon name="mdi:book-open-page-variant" class="w-5 h-5 mr-2" />
        Читати
      </span>
      <Icon name="mdi:arrow-right" class="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
    </footer>
  </article>
</template>