<template>
  <div v-if="props.isAuthor" class="works-container">
    <div class="header-wrapper">
      <div class="tabs-nav">
        <button 
          :class="['tab-btn', { active: activeTab === 'works' }]"
          @click="activeTab = 'works'"
        >
          Твори
        </button>

        <template v-if="props.isOwner">
          <span class="divider">|</span>
          <button 
            :class="['tab-btn', { active: activeTab === 'drafts' }]"
            @click="activeTab = 'drafts'"
          >
            Чернетки
          </button>
        </template>
      </div>
      
      <div class="sort-container">
        <button class="sort-trigger" @click="isSortMenuOpen = true">
          Сортувати
        </button>

        <transition name="fade">
          <div 
            v-if="isSortMenuOpen" 
            class="sort-overlay" 
            @click="isSortMenuOpen = false"
          ></div>
        </transition>

        <transition name="slide-fade">
          <div v-if="isSortMenuOpen" class="sort-menu" @click.stop>
            <button
              class="close-btn"
              @click="isSortMenuOpen = false"
              title="Закрити меню"
            >
              <svg viewBox="0 0 24 24" class="close-icon">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <h4 class="sort-title">Сортувати за:</h4>

            <ul class="sort-options">
              <li @click="sortBy = 'Title'">
                <span
                  :class="['radio-circle', { active: sortBy === 'Title' }]"
                ></span>
                Назвою
              </li>

              <li @click="sortBy = 'Description'">
                <span
                  :class="['radio-circle', { active: sortBy === 'Description' }]"
                ></span>
                Описом
              </li>

              <li @click="sortBy = 'CreatedAt'">
                <span
                  :class="['radio-circle', { active: sortBy === 'CreatedAt' }]"
                ></span>
                Датою
              </li>
            </ul>

            <button
              class="sort-order-btn"
              @click="sortDesc = !sortDesc"
              title="Змінити напрямок"
            >
              <svg v-if="!sortDesc" viewBox="0 0 24 24" class="sort-icon">
                <path
                  d="M4 18h4v-2H4v2zm0-5h8v-2H4v2zm0-7v2h12V6H4zm15 8v-4h-2v4h-3l4 4 4-4h-3z"
                  fill="currentColor"
                />
              </svg>

              <svg v-else viewBox="0 0 24 24" class="sort-icon">
                <path
                  d="M4 18h4v-2H4v2zm0-5h8v-2H4v2zm0-7v2h12V6H4zm14 8h3l-4-4-4 4h3v4h2v-4z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="activeTab === 'works'" key="works" class="scrollable-list">
        
        <div v-if="isLoading && works.length === 0" class="loading-state">Завантаження творів...</div>
        <div v-else-if="!isLoading && works.length === 0" class="loading-state">Творів не знайдено.</div>
        
        <transition-group 
          v-else 
          name="list" 
          tag="div" 
          class="works-list-wrapper"
          :class="{ 'is-fetching': isLoading }"
        >
          <div v-for="work in works" :key="work.postId" class="work-card">
            <div class="card-center">
              <h3 class="work-title">{{ work.title }}</h3>
              <span class="work-genre">
                {{ work.genres && work.genres.length > 0 ? work.genres[0] : 'Без жанру' }}
              </span>
            </div>

            <div class="work-stats">
              <span>{{ work.likesCount || 0 }} лайків</span>
              <span>{{ work.commentsCount || 0 }} коментів</span>
            </div>

            <button class="action-btn">Читати</button>
          </div>
        </transition-group>

      </div>

      <div v-else-if="activeTab === 'drafts' && props.isOwner" key="drafts">
        <Drafts :sort-by="sortBy" :sort-desc="sortDesc" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Drafts from './drafts.vue'

const props = defineProps({
  username: { type: String, required: true },
  isOwner: { type: Boolean, default: false },
  isAuthor: { type: Boolean, default: false } 
})

const config = useRuntimeConfig()
const activeTab = ref('works')
const works = ref([])
const isLoading = ref(false)
const sortBy = ref('Title')
const sortDesc = ref(false)
const isSortMenuOpen = ref(false)

const fetchPosts = async () => {
  if (!props.isAuthor) return 
  isLoading.value = true
  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014'
    
    const data = await $fetch(`${baseUrl}/api/Posts/get-posts`, {
      method: 'GET',
      params: {
        Username: props.username,
        Filter: sortBy.value,
        Ascending: !sortDesc.value
      }
    })
    works.value = data
  } catch (e) { 
    console.error("Помилка завантаження творів:", e) 
    works.value = []
  } finally { 
    isLoading.value = false 
  }
}

watch([activeTab, sortBy, sortDesc], () => {
  if (activeTab.value === 'works') fetchPosts()
}, { immediate: true })
</script>

<!-- TO REFACTOR --> 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.works-container {
  width: 100%; 
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

.header-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.tabs-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.tab-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit; 
  font-size: inherit;
  color: #333;
  transition: color 0.3s;
}

.tab-btn.active {
  color: #4a9588;
  font-weight: 600;
}

.divider {
  margin: 0 15px;
  color: #333;
}

.sort-container {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
}

.sort-trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  color: #333;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.sort-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); 
  z-index: 1000; 
  cursor: pointer; 
}

.sort-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: #E4C1D3; 
  border: 4px solid #2A7064; 
  border-radius: 12px;
  padding: 20px 30px;
  min-width: 260px;
  color: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 1002; 
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4A3A41;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 0.7;
}

.close-icon {
  width: 24px;
  height: 24px;
}

.sort-title {
  margin: 0 0 15px 0;
  font-weight: 500;
  font-size: 20px;
  color: #4A3A41;
  padding-right: 25px; 
}

.sort-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sort-options li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  color: #FFFFFF;
  font-weight: 500;
  transition: opacity 0.2s;
}

.sort-options li:hover {
  opacity: 0.8;
}

.radio-circle {
  width: 14px;
  height: 14px;
  border: 2px solid white;
  border-radius: 50%;
  display: inline-block;
  background-color: transparent;
  transition: background-color 0.2s;
}

.radio-circle.active {
  background-color: white;
}

.sort-order-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; 
  height: 40px; 
  padding: 0; 
  color: #000; 
}

.sort-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0; 
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.5, 0, 0.1, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98); 
}

.scrollable-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 550px;
  overflow-y: auto;
  padding: 20px;
  background-color: #FFF1DB; 
  border-radius: 8px; 
}

.loading-state {
  text-align: center;
  font-size: 16px;
  color: #4A3A41;
  padding: 20px 0;
}

.works-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  width: 100%;
}

.is-fetching {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.work-card {
  background-color: #4f9689;
  border: 4px solid #1c4b43;
  border-radius: 4px;
  position: relative; 
  min-height: 140px; 
  display: flex;
  align-items: center; 
  justify-content: center; 
  box-sizing: border-box; 
  width: 100%;
}

.card-center { text-align: center; }
.work-title { margin: 0 0 5px 0; font-weight: 500; color: #000; font-size: 18px; }
.work-genre { color: #000; font-size: 14px; }
.work-stats { position: absolute; bottom: 15px; left: 20px; color: #000; font-size: 14px; display: flex; gap: 20px; }

.action-btn {
  position: absolute; bottom: 15px; right: 20px; background-color: #1e4b6c; color: white;
  border: none; border-radius: 6px; padding: 8px 30px; font-family: inherit; font-size: 16px;
  cursor: pointer; transition: background-color 0.2s;
}
.action-btn:hover { background-color: #15364e; }

.scrollable-list::-webkit-scrollbar { width: 8px; }
.scrollable-list::-webkit-scrollbar-track { background: #FFE6BD; border-radius: 4px; }
.scrollable-list::-webkit-scrollbar-thumb { background: #7E4864; border-radius: 4px; }
.scrollable-list::-webkit-scrollbar-thumb:hover { background: #61344B; }
</style>