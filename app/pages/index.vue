<script setup>
import { ref } from 'vue';

const isLoggedIn = useAuth().isLoggedIn;
const nickname =  useAuth().nickname;

// Стан для модального вікна
const selectedPost = ref(null);

const posts = ref([
  {
    id: 1,
    title: "Тіні старого міста",
    description: "Містика на вулицях вечірнього Львова.",
    content: "Сонце сідало за Ратушу, залишаючи довгі тіні на бруківці площі Ринок. Здавалося, що старі кам'яниці перешіптуються між собою, згадуючи часи, коли вулицями ще їздили карети. Я щільніше закутався в пальто і пришвидшив крок, відчуваючи чийсь погляд у спину. Вітер доносив запах кави та вогкості, а десь вдалині пролунав звук, схожий на скрип старих дверей, яких тут давно не мало бути...",
    authorName: "urban_writer",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    title: "Кібер-Едем: Розділ 1",
    description: "Наукова фантастика про світ без емоцій.",
    content: "Неонове світло відбивалося в калюжах сектору 4. Система вимагала оновлення статусу, але мій нейроінтерфейс мовчав уже третю добу. Вони думають, що змогли відключити наші почуття оновленням прошивки. Вони помиляються. Кожен спалах світла, кожен шум вентиляції — це нагадування про те, що ми ще живі. У світі, де все вимірюється байтами, справжній гнів став останньою аналоговою розкішшю.",
    authorName: "neon_samurai",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    title: "Останній лист ельфійського короля",
    description: "Фентезійна мініатюра.",
    content: "Ліси вмирають, мій друже. Магія покидає це царство разом із першим снігом. Я залишаю цей пергамент під корінням Великого Дуба в надії, що колись, через тисячі років, хтось знайде його і згадає епоху, коли дерева вміли говорити. Ми йдемо на Захід, туди, де зорі торкаються моря, але наше коріння назавжди залишиться в цій попелястій землі.",
    authorName: "elven_scribe",
    createdAt: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 4,
    title: "Шепіт зірок",
    description: "Подорож за межі відомого всесвіту.",
    content: "Двигуни працювали на мінімумі. Попереду була лише порожнеча, але сенсори вловлювали дивну вібрацію. Це не був космічний шум. Це була мелодія, яку співали мертві зірки.",
    authorName: "astro_explorer",
    createdAt: new Date(Date.now() - 600000000).toISOString()
  }
]);

const openPost = (post) => {
  selectedPost.value = post;
  document.body.style.overflow = 'hidden';
};

const closePost = () => {
  selectedPost.value = null;
  document.body.style.overflow = 'auto';
};
</script>

<template>
  <div class="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <nav class="flex justify-between items-center mb-12 border-b border-plum-light/30 pb-8">
        <h1 class="text-4xl font-black text-main tracking-tighter italic">Versum</h1>
        <div class="flex items-center gap-6">
          <template v-if="isLoggedIn">
            <span class="text-main font-bold hidden sm:inline">{{ nickname }}</span>
            <button class="bg-plum-light text-main px-5 py-2 rounded-full text-sm font-bold shadow-lg">Вийти</button>
          </template>
        </div>
      </nav>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          @click="openPost(post)"
          class="group bg-cream-dark backdrop-blur-md rounded-3xl border border-plum-light/10 p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-main group-hover:text-plum-light transition-colors line-clamp-2">
              {{ post.title }}
            </h2>
          </div>
          
          <span class="text-[10px] font-black uppercase tracking-widest text-main bg-plum-light px-2 py-1 rounded-md self-start mb-4">
            @{{ post.authorName }}
          </span>
          
          <p class="text-main/90 text-base leading-relaxed flex-grow line-clamp-6">
            {{ post.content }}
          </p>
          
          <div class="mt-8 pt-6 border-t border-plum-light/10 text-[11px] font-bold text-plum-light/50 flex justify-between">
            <span>{{ new Date(post.createdAt).toLocaleDateString('uk-UA') }}</span>
            <span class="uppercase">Читати →</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div @click="closePost" class="absolute inset-0 bg-main/60 backdrop-blur-sm"></div>
          
          <div class="relative bg-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-plum-light/20 p-8 sm:p-12">
            <button 
              @click="closePost" 
              class="absolute top-6 right-6 text-plum-light hover:rotate-90 transition-transform p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <header class="mb-8 border-b border-plum-light/10 pb-6">
              <span class="text-xs font-black uppercase tracking-widest text-plum-light mb-2 block">
                Автор: @{{ selectedPost.authorName }} • {{ new Date(selectedPost.createdAt).toLocaleDateString('uk-UA') }}
              </span>
              <h2 class="text-4xl sm:text-5xl font-black text-main italic leading-tight">
                {{ selectedPost.title }}
              </h2>
            </header>

            <div class="prose prose-lg max-w-none text-main/90 leading-loose whitespace-pre-wrap font-serif">
              {{ selectedPost.content }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.min-h-screen {
  background-image: radial-gradient(var(--color-plum-light) 0.5px, transparent 0.5px);
  background-size: 40px 40px;
  background-attachment: fixed;
  background-color: var(--color-cream);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: var(--color-plum-light);
  border-radius: 10px;
}
</style>