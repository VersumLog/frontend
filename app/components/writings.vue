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

        <span v-if="props.isOwner" class="divider">|</span>

        <button 
          v-if="props.isOwner"
          :class="['tab-btn', { active: activeTab === 'drafts' }]"
          @click="activeTab = 'drafts'"
        >
          Чернетки
        </button>
      </div>
      
      <div class="sort-container">
        <button class="sort-trigger" @click="isSortMenuOpen = true">Сортувати</button>
        </div>
    </div>

    <div v-if="activeTab === 'works'" class="scrollable-list">
      <div v-if="isLoading" class="loading-state">Завантаження...</div>
      <div v-else-if="works.length === 0" class="loading-state">Творів не знайдено.</div>
      <div v-else v-for="work in works" :key="work.postId" class="work-card">
        </div>
    </div>

    <div v-else>
      <Drafts :sort-by="sortBy" :sort-desc="sortDesc" />
    </div>
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
    const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7014'
    const queryParams = new URLSearchParams({
      Username: props.username,
      Filter: sortBy.value,
      Ascending: !sortDesc.value
    }).toString()
    const response = await fetch(`${baseUrl}/api/Posts/get-posts?${queryParams}`)
    if (response.ok) works.value = await response.json()
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

watch([activeTab, sortBy, sortDesc], () => {
  if (activeTab.value === 'works') fetchPosts()
}, { immediate: true })
</script>

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
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001; 
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
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000; 
}

.sort-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 15px;
  background-color: #E4C1D3; 
  border: 4px solid #2A7064; 
  border-radius: 12px;
  padding: 20px 30px;
  min-width: 260px;
  color: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
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
  padding: 5px;
  color: #000; 
}

.sort-icon {
  width: 28px;
  height: 28px;
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-leave-active {
  transition: opacity 0.2s ease;
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