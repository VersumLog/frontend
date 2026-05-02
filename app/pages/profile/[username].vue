<script setup lang="ts">
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
const { token, nickname } = useAuth();


const handleEdit = (payload?: any) => {
  console.log("Користувач натиснув 'Редагувати'", payload);
};

const { data: userData, error, refresh } = await useFetch<any>(`${config.public.apiBase}/api/profile/${username}`, {
  headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
  server: false
})

if (error.value) {
  console.error("Помилка завантаження профілю:", error.value)
}
</script>

<template>
  <div class="profile-container">
    <UserPage v-if="userData" :userData="userData" @edit="handleEdit" @refresh-data="refresh" />


    <!-- searching animation -->
    <div v-if="!userData && !error" class="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-[#FDE9D1] rounded-[40px]">
      <div class="relative flex items-center justify-center">
        <!-- glow -->
        <div class="absolute animate-ping h-20 w-20 rounded-full bg-[#744458] opacity-10"></div>

        <!-- circle -->
        <div class="relative rounded-full h-14 w-14 border-4 border-[#744458]/10 border-t-[#744458] animate-spin"></div>

        <!-- icon -->
        <span class="absolute text-xl animate-spin">
          <Icon name="tabler:user-search" class="w-12 h-12 text-[#744458]" />
        </span>
      </div>

      <div class="text-center space-y-3">
        <h3 class="text-2xl font-black text-[#744458] tracking-tight animate-pulse">
          Завантажуємо профіль...
        </h3>

        <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-[#744458]/5 border border-[#744458]/10">
          <span class="text-[#744458] font-semibold text-sm">
            Готуємо сторінку для
            <span class="underline decoration-wavy decoration-[#744458]/30">@{{ username }}</span>
          </span>
        </div>
      </div>

      <div class="flex gap-2">
        <div class="h-2 w-2 rounded-full bg-[#744458] animate-bounce [animation-delay:-0.3s]"></div>
        <div class="h-2 w-2 rounded-full bg-[#744458] animate-bounce [animation-delay:-0.15s]"></div>
        <div class="h-2 w-2 rounded-full bg-[#744458] animate-bounce"></div>
      </div>
    </div>


    <!-- Not Found -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    <div class="bg-white/50 p-12 rounded-[40px] border-2 border-dashed border-[#744458]/20 max-w-lg w-full">
      <span class="text-6xl mb-6 block">🔍</span>
      
      <h2 class="text-3xl font-black text-[#744458] mb-2">Користувача не знайдено</h2>
      <p class="text-[#744458]/70 mb-8">
        На жаль, профілю з нікнеймом <span class="font-bold text-[#744458]">@{{ username }}</span> не існує або він був видалений.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="navigateTo('/')" 
          class="bg-[#744458] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5a3444] transition-colors">
          На головну
        </button>
      </div>
    </div>
  </div>


  </div>
</template>