<script setup lang="ts">
import { ref } from 'vue';
import type { PostGetDto } from '@/types/post';
import WordPopover from '@/components/posts/reading/WordPopover.vue';

const props = defineProps<{
  post: PostGetDto;
}>();

const activeWord = ref('');
const activeDescription = ref('');
const activeAnchorId = ref('');
const isPopoverOpen = ref(false);

const handleContentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const descriptionElement = target.closest('.has-description');
  
  if (descriptionElement) {
    const descriptionText = descriptionElement.getAttribute('description') || descriptionElement.getAttribute('data-description');
    const id = descriptionElement.getAttribute('id');
    
    if (descriptionText && id) {
      activeWord.value = descriptionElement.textContent?.trim() || '';
      activeDescription.value = descriptionText;
      activeAnchorId.value = id;
      isPopoverOpen.value = true;
    }
  }
};
</script>

<template>
  <article class="max-w-4xl mx-auto px-4 md:px-8 py-10 text-main overflow-x-hidden">
    <div class="text-center mb-10 w-full">
      <h1 class="text-3xl md:text-5xl font-black mb-3 text-plum tracking-tight break-words">
        {{ post.title }} 
      </h1>
      
      <p class="text-lg md:text-xl font-medium tracking-wide text-main/80 mb-4 break-all">
        {{ post.name || post.username }}
      </p>
      
      <div v-if="post.genres && post.genres.length" class="flex flex-wrap justify-center gap-2 mb-6">
        <span 
          v-for="genre in post.genres" 
          :key="genre"
          class="bg-plum/5 text-plum border border-plum/10 px-4 py-1 rounded-full text-xs font-bold tracking-wide"
        >
          {{ genre }}
        </span>
      </div>

      <p v-if="post.description" class="text-base italic text-main/60 max-w-2xl mx-auto bg-white/40 p-4 rounded-2xl border border-plum/5 break-words">
        {{ post.description }}
      </p>
    </div>
    
    <div 
      class="article-body space-y-5 text-base md:text-lg leading-relaxed text-justify whitespace-pre-wrap select-text transition-all break-words"
      @click="handleContentClick"
      v-html="post.content"
    ></div>

    <WordPopover 
      :word="activeWord" 
      :description="activeDescription" 
      :postId="post.postId" 
      :anchorId="activeAnchorId"
      :is-open="isPopoverOpen" 
      @close="isPopoverOpen = false" 
    />
  </article>
</template>

<style>
.article-body .has-description {
  background-color: rgba(var(--color-mint-light-rgb), 0.3) !important;
  border-bottom: 2px dashed var(--color-mint);
  padding: 0 4px;
  border-radius: 4px;
  cursor: help;
  transition: all 0.2s ease;
}

.article-body .has-description:hover {
  background-color: rgba(var(--color-mint-light-rgb), 0.6) !important;
  color: var(--color-plum);
}

.article-body img,
.article-body video,
.article-body iframe {
  max-width: 100%;
  height: auto;
}

.article-body table {
  display: block;
  width: 100%;
  overflow-x: auto;
}
</style>