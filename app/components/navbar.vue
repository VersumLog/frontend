<script setup lang="ts">
import { computed } from 'vue'
import NotificationDropdown from './notifications/NotificationDropdown.vue';

const { isLoggedIn, nickname } = useAuth();
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const profilePath = computed(() => {
  return isLoggedIn.value ? `/profile/${nickname.value}` : '/register'
});
</script>

<template>
  <!-- Головна навігація -->
  <nav class="fixed top-0 left-0 w-full z-50 bg-plum-light py-3.5 rounded-b-[25px] shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
    <div class="max-w-full flex items-center justify-between px-5 lg:pl-10 lg:pr-[60px]">

      <!-- Логотип -->
      <NuxtLink to="/"
        class="bg-cream-dark rounded-full w-[50px] h-[50px] mr-2.5 sm:w-[60px] sm:h-[60px] sm:mr-5 min-[1280px]:mr-[150px] flex justify-center items-center shrink-0 transition-transform hover:scale-105">
        <img src="/logo.png" alt="Versum" class="w-[35px] sm:w-[45px]" />
      </NuxtLink>

      <!-- Контейнер пошуку (Тільки для великих екранів) -->
      <div class="hidden lg:flex flex-1 min-[1440px]:mr-[300px]">
        <input type="text" placeholder="Пошук"
          class="w-full py-3.5 px-[25px] rounded-md border-none font-sans text-lg outline-none text-black bg-white focus:ring-2 focus:ring-cream-dark/50 transition-all" />
      </div>

      <!-- Навігаційні іконки -->
      <div class="flex gap-5 text-white md:gap-[55px] md:ml-5">

        <button @click="toggleDark"
          class=" items-center cursor-pointer no-underline text-white transition-opacity duration-200 hover:opacity-80"
          active-class="!text-main" title="Змінити тему">
          <Icon :name="colorMode.value === 'dark' ? 'lucide:moon' : 'lucide:sun'" class="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <!-- Збережене -->
        <NuxtLink to="/saved"
          class="flex flex-col items-center cursor-pointer no-underline text-white transition-opacity duration-200 hover:opacity-80"
          active-class="!text-main">
          <Icon name="lucide:bookmark" class="w-6 h-6 sm:w-7 sm:h-7" />
          <span class="hidden sm:block text-xs font-semibold mt-1.25">Збережене</span>
        </NuxtLink>

        <!-- Словник -->
        <NuxtLink to="/dictionary"
          class="flex flex-col items-center cursor-pointer no-underline text-white transition-opacity duration-200 hover:opacity-80"
          active-class="!text-main">
          <Icon name="lucide:book-open" class="w-6 h-6 sm:w-7 sm:h-7" />
          <span class="hidden sm:block text-xs font-semibold mt-1.25">Словник</span>
        </NuxtLink>

        <!-- Сповіщення -->
        <NotificationDropdown />
        

        <!-- Профіль / Вхід -->
        <NuxtLink :to="profilePath"
          class="flex flex-col items-center cursor-pointer no-underline text-white transition-opacity duration-200 hover:opacity-80"
          active-class="!text-main">
          <Icon name="lucide:user" class="w-6 h-6 sm:w-7 sm:h-7" />
          <span class="hidden sm:block text-xs font-semibold mt-1.25">
            {{ isLoggedIn ? 'Профіль' : 'Увійти' }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>