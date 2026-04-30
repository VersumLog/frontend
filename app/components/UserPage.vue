<script setup lang="ts">
import { ref, computed } from 'vue';
import ChangeProfile from '~/components/changeprofile.vue'

interface UserProfile {
  username: string;
  name: string;
  bio: string;
  createdAt: string;
  isOwner: boolean;
}

const props = defineProps<{
  userData?: UserProfile
}>();

const isOwnProfile = computed(() => props.userData?.isOwner ?? false);
const isAuthor = ref(false);
const activeTab = ref('Збережене');

const emit = defineEmits(['edit']);
</script>

<template>
  <div v-if="userData" class="profile-wrapper">
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo-box">
          <img src="/logo.png" alt="Versum" class="logo-img"/>
        </div>
        <div class="search-container">
          <input type="text" placeholder="Пошук" class="search-input"/>
        </div>
        <div class="nav-icons">
          <div class="nav-item">🔖 <span class="nav-label">Збережене</span></div>
          <div class="nav-item">📖 <span class="nav-label">Словник</span></div>
          <div class="nav-item">🔔 <span class="nav-label">Сповіщення</span></div>
          <div class="nav-item active">👤 <span class="nav-label">Профіль</span></div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      
      <div class="header-section">
        <div class="left-col">
          <div class="avatar-circle">
            <span class="emoji-avatar">👤</span>
          </div>
          <div class="user-names">
            <h2>{{ userData?.name }}</h2>
            <span>@{{ userData.username }}</span>
          </div>
        </div>

        <div class="right-col">
          
          <div class="top-info-row">
            <div class="stats-group">
              <div class="stat-item">Підписок <strong>2</strong></div>
              <div class="stat-item">Підписників <strong>22</strong></div>
            </div>

            <div class="actions">
              <template v-if="isOwnProfile">
                <button v-if="!isAuthor" class="teal-btn">Стати автором</button>
                <button v-else class="teal-btn">Створити твір</button>
              </template>
            </div>
          </div>

          <div class="bio-container">
            <div class="bio-card">
              <span class="bio-title">Про мене:</span>
              <p>{{ userData.bio }}</p>
            <ChangeProfile v-if="isOwnProfile" class="settings-btn"></ChangeProfile>
          </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h3 class="section-title">{{ activeTab }}</h3>
        <div class="works-list">
          <div v-for="i in 4" :key="i" class="work-stripe"></div>
        </div>
      </div>

      <div v-if="isOwnProfile" class="danger-zone footer-actions">
        <button class="delete-link">Видалити акаунт</button>
      </div>

    </main>
  </div>
  <div v-else class="loading-state">
    <p>Завантаження профілю...</p>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.profile-wrapper {
  --bg-page: #FDE9D1;
  --bg-navbar: #744458;
  --bg-bio: #FFE6B7;
  --teal-accent: #43A08E;
  --settings-pink: #CBA3B3;
  --text-main: #04151F;

  background-color: var(--bg-page);
  min-height: 100vh;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  color: var(--text-main);
}

.navbar {
  background-color: var(--bg-navbar);
  padding: 15px 0;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}

.nav-content {
  max-width: 100%; 
  display: flex;
  align-items: center;
  padding-left: 40px;
  padding-right: 60px;
}

.logo-box {
  margin-right: 150px; 
  background: #e9c99d;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img { width: 45px; }

.search-container {
  flex: 1;
  margin-right: 300px;
  display: flex;
}

.search-input {
  max-width: 100%;
  padding: 14px 25px;
  border-radius: 6px;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
}

.search-input::placeholder {
  font-family: 'Montserrat', sans-serif;
  color: #888888;
  font-size: 18px;
  font-weight: 500;
}

.nav-icons {
  display: flex;
  gap: 55px;
  margin-left: 100px; 
  color: white;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 28px;
  cursor: pointer;
  size: 50cap;
}

.nav-label { font-size: 14px; font-weight: 600; margin-top: 5px; }

.main-content {
  max-width: 1300px;
  margin: 50px auto;
  padding: 10px 10px;
}

.header-section {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.left-col {
  width: 220px;
  text-align: center;
}

.avatar-circle {
  width: 220px;
  height: 220px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.emoji-avatar { font-size: 100px; }

.user-names h2 { font-size: 32px; font-weight: 900; margin: 0;}
.handle { font-size: 20px; color: #555; }

.right-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.top-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.stats-group {
  display: flex;
  gap: 40px;
  font-size: 24px;
}

.stat-item {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}

.stats-group strong { font-weight: 900; font-size: 26px; }

.teal-btn {
  background-color: var(--teal-accent);
  color: white;
  border: 2px solid #368273;
  padding: 14px 40px;
  border-radius: 15px;
  font-size: 22px;
  font-weight: bold;
  box-shadow: 0 5px 0px #2D6A5F;
  cursor: pointer;
}

.bio-card {
  background-color: var(--bg-bio);
  padding: 40px;
  border-radius: 40px;
  position: relative;
  min-height: 180px;
}

.bio-title {
  display: block;
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  font-size: 24px;
  margin-bottom: 15px;
  color: var(--text-main);
}

.bio-header { font-size: 24px; font-weight: 800; display: block; margin-bottom: 15px; }
.bio-text { font-size: 20px; line-height: 1.5; margin: 0; }

.settings-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: var(--settings-pink);
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.section-title { font-size: 28px; font-weight: 900; margin: 60px 0 25px; }

.works-list { display: flex; flex-direction: column; gap: 20px; }

.work-stripe {
  background-color: var(--teal-accent);
  height: 85px;
  border-radius: 15px;
}

.footer-actions { text-align: center; margin-top: 80px; padding-bottom: 50px; }
.delete-link {
  background: none; border: none; color: var(--bg-navbar);
  text-decoration: underline; font-size: 18px; cursor: pointer;
}
</style>