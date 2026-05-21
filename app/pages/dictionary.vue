<script setup lang="ts">
import DictionaryWordCard from '@/components/DictionaryWordCard.vue';
import type { DictionaryItem } from '@/types/dictionaryItem';
import PostLoader from '@/components/posts/PostLoader.vue';

const config = useRuntimeConfig();
const { token } = useAuth();

const words = ref<DictionaryItem[]>([]);
const isLoading = ref(true);

const fetchDictionary = async () => {
  try {
    words.value = await $fetch<DictionaryItem[]>(`${config.public.apiBase}/api/dict/get-dictionary`, {
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
    });
  } catch (e) {
    console.error('Помилка завантаження словника', e);
  } finally {
    isLoading.value = false;
  }
};
// TODO
const deleteWord = async (id: string | number) => {
  words.value = words.value.filter(w => w.id !== id);
  try {
    await $fetch(`${config.public.apiBase}/api/dict/delete-phrase`, {
      method: 'DELETE',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
    });
  } catch (e) {
    console.error('Не вдалося видалити слово', e);
    fetchDictionary();
  }
};

onMounted(() => {
  fetchDictionary();
});
</script>

<template>
  <div class="bg-cream min-h-screen py-12 font-sans selection:bg-plum/20">
    <div class="max-w-4xl mx-auto px-4">
      
      <div class="flex items-center gap-3 mb-8">
        <div class="p-3 bg-plum/5 text-plum rounded-2xl">
          <Icon name="lucide:book-marked" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-plum tracking-tight">Мій словник</h1>
          <p class="text-sm text-main/60">Збережені слова та вирази з творів</p>
        </div>
      </div>

      <PostLoader v-if="isLoading" />

      <div v-else-if="!words.length" class="text-center py-16 bg-white/40 border-2 border-dashed border-plum/10 rounded-[32px]">
        <span class="text-4xl block mb-3">📖</span>
        <p class="text-main/60 font-medium">Твій словник поки що порожній</p>
      </div>

      <div v-else class="grid gap-4">
        <DictionaryWordCard 
          v-for="wordItem in words" 
          :key="wordItem.id" 
          :item="wordItem"
          @delete="deleteWord" 
        />
      </div>

    </div>
  </div>
</template>