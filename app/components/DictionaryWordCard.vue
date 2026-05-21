<!-- components/dictionary/DictionaryWordCard.vue -->
<script setup lang="ts">
import type { DictionaryItem } from '@/types/dictionaryItem';

defineProps<{
  item: DictionaryItem;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string | number): void;
}>();

const isDeleting = ref(false);

const handleDelete = (id: string | number) => {
  isDeleting.value = true;
  setTimeout(() => {
    emit('delete', id);
  }, 200);
};
</script>

<template>
  <div 
    class="bg-white/70 backdrop-blur-md border border-plum/10 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-plum/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group relative overflow-hidden"
    :class="{ 'opacity-0 scale-95 pointer-events-none': isDeleting }"
  >
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-mint transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

    <div class="space-y-2 flex-1 pl-0 group-hover:pl-2 transition-all duration-300">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-xl font-black text-plum tracking-tight">
          «{{ item.phrase }}»
        </h3>
        
        <span 
          v-if="item.post?.title" 
          class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-plum/5 text-plum/70 max-w-[180px] truncate"
          :title="item.post.title"
        >
          {{ item.post.title }}
        </span>
      </div>
      
      <p class="text-main/80 text-sm md:text-base leading-relaxed font-medium">
        {{ item.description }}
      </p>
    </div>

    <div class="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
      <NuxtLink 
        :to="`/read/${item.postId}#${item.anchorId}`"
        class="flex items-center gap-2 px-4 py-2.5 bg-cream hover:bg-plum hover:text-white text-plum rounded-xl text-xs font-bold border border-plum/10 shadow-sm transition-all duration-200 active:scale-95 group/btn"
      >
        <Icon name="lucide:text-select" class="w-4 h-4 transform group-hover/btn:rotate-6 transition-transform" />
        <span>До твору</span>
      </NuxtLink>

      <button 
        @click="handleDelete(item.id)"
        class="p-2.5 text-main/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-90"
        title="Видалити зі словника"
      >
        <Icon name="lucide:trash-2" class="w-4.5 h-4.5" />
      </button>
    </div>
  </div>
</template>