<script setup lang="ts">
defineProps<{
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleLike'): void;
  (e: 'openComments'): void;
  (e: 'toggleSave'): void;
}>();
</script>

<template>
  <div class="max-w-3xl mx-auto w-full px-4 md:px-8 mt-12 mb-16">
    <!-- Стильна картка з ефектом скла та легкою тінню -->
    <div class="bg-plum-light backdrop-blur-md border border-muted rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
      
      <!-- Лівий блок: Лайк + Коментарі -->
      <div class="flex items-center gap-3">
        <!-- Кнопка Лайку -->
        <button 
          @click="emit('toggleLike')" 
          class="flex items-center gap-2.5 group px-4 py-2.5 rounded-2xl transition-all duration-200 focus:outline-none"
          :class="isLiked ? 'text-plum bg-plum/5' : 'text-main hover:text-plum hover:bg-plum/5'"
        >
          <Icon 
            :name="isLiked ? 'ph:thumbs-up-fill' : 'ph:thumbs-up'" 
            class="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" 
          />
          <span class="text-sm font-bold tracking-wide">{{ likesCount }}</span>
        </button>

        <!-- Кнопка коментарів -->
        <button 
          @click="emit('openComments')" 
          class="flex items-center gap-2 group px-4 py-2.5 rounded-2xl text-main hover:text-plum hover:bg-plum/5 transition-all duration-200 focus:outline-none"
        >
          <Icon 
            name="ph:chat-teardrop" 
            class="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-200" 
          />
          <span class="text-xs font-semibold hidden sm:inline text-main/80 group-hover:text-plum">Обговорення</span>
        </button>
      </div>

      <!-- Правий блок: Закладки + Додатково -->
      <div class="flex items-center gap-2">
        <!-- Кнопка збереження -->
        <button 
          @click="emit('toggleSave')" 
          class="p-2.5 rounded-xl transition-all duration-200 group focus:outline-none"
          :class="isSaved ? 'text-plum bg-plum/5' : 'text-main hover:text-plum hover:bg-plum/5'"
          title="Зберегти у закладки"
        >
          <Icon 
            :name="isSaved ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple'" 
            class="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform duration-200" 
          />
        </button>

        <!-- Розділювач -->
        <div class="w-px h-6 bg-plum/10 mx-1"></div>
        
        <!-- Емодзі реакції -->
        <button 
          class="p-2.5 rounded-xl text-main hover:text-plum hover:bg-plum/5 transition-all duration-200 group focus:outline-none"
          title="Залишити реакцію"
        >
          <Icon 
            name="ph:smiley" 
            class="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" 
          />
        </button>
      </div>

    </div>
  </div>
</template>