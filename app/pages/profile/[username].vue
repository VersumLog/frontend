<script setup lang="ts">
import ProfilePage from '~/components/UserPage.vue'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

interface UserProfile {
  username: string;
  name: string;
  bio: string;
  createdAt: string;
  isOwner: boolean;
}

const route = useRoute();
const username = route.params.username;
const config = useRuntimeConfig();
const userData = ref<UserProfile | null>(null);

const handleEdit = (payload?: any) => {
  console.log("Користувач натиснув 'Редагувати'", payload);
};

onMounted(async () => {
  try {
    const token = useCookie('auth_token').value; 

    const response = await $fetch(<any>`${config.public.apiBase}/api/profile/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    userData.value = response;
    
  } catch (error) {
    console.error("Помилка завантаження профілю:", error);
  }
});
</script>

<template>
  <div class="profile-container">
    <p v-if="!userData" style="color: gray; font-size: 10px;">Статус: Чекаємо на дані для {{ username }}...</p>

    <ProfilePage 
      v-if="userData" 
      :userData="userData" 
      @edit="handleEdit" 
    />
    
    <div v-else class="loading">Завантаження профілю...</div>
  </div>
</template>