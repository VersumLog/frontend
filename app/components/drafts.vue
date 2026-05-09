<template>
  <div class="scrollable-list">
    <div v-if="isLoading" class="loading-state">Завантаження чернеток...</div>
    <div v-else-if="drafts.length === 0" class="loading-state">Чернеток не знайдено.</div>

    <div v-else v-for="draft in drafts" :key="draft.postId || draft.id" class="work-card">
      <div class="card-center">
        <h3 class="work-title">{{ draft.title }}</h3>
        <span class="work-genre">{{ draft.genres?.[0]?.name || 'Жанр' }}</span>
      </div>
      
      <button class="action-btn">Редагувати</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  sortBy: {
    type: String,
    default: 'Title'
  },
  sortDesc: {
    type: Boolean,
    default: false
  }
})

const drafts = ref([])
const isLoading = ref(false)

const fetchDrafts = async () => {
  isLoading.value = true
  try {
    const isAscending = !props.sortDesc

    const queryParams = new URLSearchParams({
      Filter: props.sortBy,
      Ascending: isAscending
    }).toString()

    const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7014'
    
    const token = localStorage.getItem('token') 

    const response = await fetch(`${baseUrl}/api/Posts/get-drafts?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      drafts.value = await response.json()
    } else {
      console.error('Помилка завантаження чернеток')
      drafts.value = []
    }
  } catch (error) {
    console.error('Мережева помилка:', error)
  } finally {
    isLoading.value = false
  }
}

watch([() => props.sortBy, () => props.sortDesc], () => {
  fetchDrafts()
}, { immediate: true })
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