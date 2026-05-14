<template>
  <div class="scrollable-list">
    <div v-if="isLoading && drafts.length === 0" class="loading-state">Завантаження чернеток...</div>
    <div v-else-if="!isLoading && drafts.length === 0" class="loading-state">Чернеток не знайдено.</div>

    <transition-group 
      v-else 
      name="list" 
      tag="div" 
      class="drafts-list-wrapper"
      :class="{ 'is-fetching': isLoading }"
    >
      <div v-for="draft in drafts" :key="draft.postId || draft.id" class="work-card">
        
        <div class="card-center">
          <h3 class="work-title">{{ draft.title }}</h3>
          <span class="work-genre">{{ draft.genres?.[0]?.name || 'Жанр' }}</span>
        </div>
        
        <div class="card-actions">
          <button class="action-btn">Редагувати</button>

          <button 
            class="delete-cross-btn"
            @click="openDeleteModal(draft)"
            title="Видалити чернетку"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </transition-group>

    <deletePost 
      :isOpen="isDeleteModalOpen" 
      @close="closeDeleteModal" 
      @confirm="handleDeleteConfirm" 
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import deletePost from './deletePost.vue'

const props = defineProps({
  sortBy: { type: String, default: 'Title' },
  sortDesc: { type: Boolean, default: false }
})

const drafts = ref([])
const isLoading = ref(false)
const config = useRuntimeConfig()
const tokenCookie = useCookie('auth_token') 

const isDeleteModalOpen = ref(false)
const draftToDelete = ref(null)

const openDeleteModal = (draft) => {
  draftToDelete.value = draft
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  draftToDelete.value = null
}

const handleDeleteConfirm = async () => {
  if (!draftToDelete.value) return;
  
  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014';
    const token = tokenCookie.value;

    const id = draftToDelete.value.postId || draftToDelete.value.id;

    await $fetch(`${baseUrl}/api/Posts/${id}/delete-post`, {
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });

    drafts.value = drafts.value.filter(d => (d.postId || d.id) !== id);
    console.log(`Чернетку успішно видалено`);
    
  } catch (error) {
    console.error("Помилка при видаленні чернетки з бекенду:", error);
  } finally {
    closeDeleteModal();
  }
}

const fetchDrafts = async () => {
  const token = tokenCookie.value
  if (!token) return;
  
  isLoading.value = true
  try {
    const baseUrl = config.public.apiBase || 'https://localhost:7014'
    const data = await $fetch(`${baseUrl}/api/Posts/get-drafts`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      params: { Filter: props.sortBy, Ascending: !props.sortDesc }
    })
    drafts.value = data
  } catch (error) {
    console.error('Помилка завантаження чернеток:', error)
    drafts.value = []
  } finally {
    isLoading.value = false
  }
}

watch([() => props.sortBy, () => props.sortDesc], () => fetchDrafts(), { immediate: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.scrollable-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 550px;
  overflow-y: auto;
  padding: 20px;
  background-color: #FFF1DB;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
}

.loading-state {
  text-align: center;
  font-size: 16px;
  color: #4A3A41;
  padding: 20px 0;
}

.drafts-list-wrapper {
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

/* КЛАС ДЛЯ КОНТЕЙНЕРА КНОПОК */
.card-actions {
  position: absolute !important;
  bottom: 15px !important;
  right: 20px !important;
  display: flex !important;
  align-items: center !important; 
  gap: 12px !important;
  z-index: 10;
}

.action-btn {
  position: static !important;
  background-color: #1e4b6c; 
  color: white;
  border: none; 
  border-radius: 6px; 
  padding: 8px 30px; 
  font-family: inherit; 
  font-size: 16px;
  cursor: pointer; 
  transition: background-color 0.2s;
  height: fit-content;
}

.action-btn:hover { 
  background-color: #15364e; 
}

.delete-cross-btn {
  position: static !important;
  background-color: transparent;
  border: 2px solid #1c4b43;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1c4b43;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;
}

.delete-cross-btn:hover {
  background-color: #1c4b43;
  color: #4f9689;
  transform: scale(1.1);
}

.card-center { text-align: center; }
.work-title { margin: 0 0 5px 0; font-weight: 500; color: #000; font-size: 18px; }
.work-genre { color: #000; font-size: 14px; }

/* Scrollbar styles... */
.scrollable-list::-webkit-scrollbar { width: 8px; }
.scrollable-list::-webkit-scrollbar-track { background: #FFE6BD; border-radius: 4px; }
.scrollable-list::-webkit-scrollbar-thumb { background: #7E4864; border-radius: 4px; }
.scrollable-list::-webkit-scrollbar-thumb:hover { background: #61344B; }
</style>