<script setup lang="ts">
import { ref, computed } from 'vue';
import BecomeAuthor from './become_author.vue';
import AuthorBadge from './author_badge.vue';
import DeleteAccount from './deleteAccount.vue';
import Writings from './writings.vue';

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

const emit = defineEmits(['edit', 'refresh-data']);
</script>

<template>
  <div v-if="userData" class="min-h-screen bg-[#FDE9D1] text-[#04151F] font-sans">
    <main class="mx-auto max-w-[1300px] px-4 py-8 md:py-[60px]">

      <!-- Header Section -->
      <div class="flex flex-col md:flex-row gap-8 md:gap-[60px] items-center md:items-start">

        <!-- Left Column: Avatar & Names -->
        <div class="w-full md:w-[220px] flex flex-col items-center text-center">
          <div
            class="w-[180px] h-[180px] md:w-[220px] md:h-[220px] bg-white rounded-full flex items-center justify-center shadow-lg mb-5">
            <span class="text-[80px] md:text-[100px]">👤</span>
          </div>
          <div class="space-y-1">
            <h2 class="text-2xl md:text-[32px] font-black leading-tight">{{ userData?.name }}</h2>
            <span class="text-lg md:text-xl text-gray-600 block">@{{ userData.username }}</span>
          </div>
        </div>

        <!-- Right Column: Stats, Actions & Bio -->
        <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">

          <!-- Stats & Actions Row -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-6 pt-2">
            <div class="flex gap-6 md:gap-10 text-xl md:text-2xl font-medium">
              <div class="whitespace-nowrap">Підписок <strong class="font-black text-2xl md:text-[26px]">2</strong>
              </div>
              <div class="whitespace-nowrap">Підписників <strong class="font-black text-2xl md:text-[26px]">22</strong>
              </div>
            </div>

            <div class="w-full sm:w-auto">
              <template v-if="isOwnProfile">
                <become_author v-if="!isAuthor" class="w-full sm:w-auto" />
                <button v-else class="teal-btn w-full sm:w-auto">Створити твір</button>
              </template>
            </div>
          </div>

          <!-- Bio Card -->
          <div
            class="relative bg-[#FFE6B7] p-6 md:p-10 rounded-[30px] md:rounded-[40px] min-h-[150px] md:min-h-[180px] shadow-sm">
            <span class="block font-extrabold text-xl md:text-24px mb-3 uppercase tracking-wide">Про мене:</span>
            <p class="text-base md:text-xl leading-relaxed text-[#04151F] break-all sm:break-words whitespace-normal">
              {{ userData.bio }}
            </p>

            <changeprofile v-if="isOwnProfile" :user-data="userData" @profile-updated="$emit('refresh-data')"
              class="absolute bottom-4 right-4 md:bottom-6 ">
            </changeprofile>
          </div>
          <author_badge v-if="isAuthor" :username="userData.username" />
        </div>
      </div>

      <!-- Content Section -->
      <div class="mt-12 md:mt-16">
        <Writings 
          :username="userData.username"
          :is-owner="userData.isOwner"
/>
      </div>

<!-- Footer Actions -->
      <div v-if="isOwnProfile" class="mt-16 md:mt-20 mb-10 text-center">
        <deleteAccount />
      </div>
      <div v-if="isOwnProfile">
        <button @click="useAuth().logout()">Вийти</button>
      </div>
    </main>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen bg-[#FDE9D1]">
    <p class="text-xl font-bold animate-pulse">Завантаження профілю...</p>
  </div>
</template>

<style scoped>
.teal-btn {
  background-color: #43A08E;
  color: white;
  border: 2px solid #368273;
  padding: 12px 32px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 5px 0px #2D6A5F;
  transition: all 0.1s active;
}

@media (min-width: 768px) {
  .teal-btn {
    padding: 14px 40px;
    font-size: 22px;
  }
}

.teal-btn:active {
  box-shadow: 0 2px 0px #2D6A5F;
  transform: translateY(3px);
}
</style>