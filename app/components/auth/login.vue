<script setup lang="ts">
import { ref } from 'vue';
const errorMessage = ref('');
const config = useRuntimeConfig();

const email = ref('');
const password = ref('');
const emailFieldError = ref('');
const passwordFieldError = ref('');
const isEmailValid = ref(false);
const isPasswordValid = ref(false);

defineEmits(['signup', 'forgot']);

const handleEmailBlur = () => {
  if (!email.value || email.value.trim() === '') {
    emailFieldError.value = 'Введіть свій нікнейм або email';
    isEmailValid.value = false;
  } else {
    emailFieldError.value = '';
    isEmailValid.value = true;
  }
};

const handlePasswordBlur = () => {
  if (!password.value || password.value.trim() === '') {
    passwordFieldError.value = 'Введіть свій пароль';
    isPasswordValid.value = false;
  } else {
    passwordFieldError.value = '';
    isPasswordValid.value = true;
  }
};

const handleLogin = async () => {
  errorMessage.value = '';

  handleEmailBlur();
  handlePasswordBlur();

  if (emailFieldError.value || passwordFieldError.value) {
    return;
  }
  if (!email.value || !password.value) {
    errorMessage.value = "Будь ласка, заповніть всі поля";
    return;
  }

  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 1440, // 24 hours
    sameSite: 'lax',
    secure: config.public.isProd,
  });

  try {
    const response = await $fetch<any>(`${config.public.apiBase}/api/Auth/login`, {
      method: 'POST',
      body: {
        UsernameOrGmail: email.value,
        Password: password.value
      }
    });
    console.log("Успіх:", response);
    if (response.token && response.username) {
      tokenCookie.value = response.token;

      const userNickname = useCookie('user_nickname', {
        maxAge: 60 * 1440,
        sameSite: 'lax',
        secure: config.public.isProd,
      });
      userNickname.value = response.username;

      console.log("Токен та нікнейм збережено!");
      navigateTo('/');
    }
  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else {
      errorMessage.value = error.data?.message || "Не вдалося ввійти";
    }
    console.error("Помилка при логіні:", error);
  }
};
</script>

<template>
  <div class="w-[80%] lg:w-[30vw] mx-auto bg-cream-dark p-10 rounded-[32px] relative font-sans">
    <div class="absolute top-5 left-5 flex items-center gap-2 text-main font-bold text-sm">
      <!-- Тут може бути іконка чи тег, залишив блок для збереження структури -->
    </div>

    <h1 class="text-center text-[32px] font-black text-main my-10">З ПОВЕРНЕННЯМ!</h1>

    <div class="flex flex-col gap-[15px]">
      <!-- Поле Email / Нікнейм -->
      <div class="flex flex-col gap-1.5">
        <input v-model="email" type="text" placeholder="Введіть нікнейм або email" @blur="handleEmailBlur"
          @input="emailFieldError = ''; isEmailValid = false"
          class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-base box-border transition-all duration-200 focus:outline focus:border-mint focus:outline-2 focus:outline-plum"
          :class="{ '!border-mint': isEmailValid, '!border-[#F44336]': emailFieldError }" />
        <span v-if="emailFieldError" class="text-[#F44336] text-xs -mt-1 ml-3">{{ emailFieldError }}</span>
      </div>

      <!-- Поле Паролю -->
      <div class="flex flex-col gap-1.5">
        <input v-model="password" type="password" placeholder="Пароль" @blur="handlePasswordBlur"
          @input="passwordFieldError = ''; isPasswordValid = false"
         class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-base box-border transition-all duration-200 focus:outline focus:border-mint focus:outline-2 focus:outline-plum"
          :class="{ '!border-mint': isPasswordValid, '!border-[#F44336]': passwordFieldError }" />
        <span v-if="passwordFieldError" class="text-[#F44336] text-xs -mt-1 ml-3">{{ passwordFieldError }}</span>
      </div>
    </div>

    <!-- Загальна помилка від бекенду -->
    <p v-if="errorMessage"
      class="text-[#d9534f] bg-[#fce8e8] p-2.5 rounded-lg text-center text-sm mt-[15px] border border-[#d9534f]">
      {{ errorMessage }}
    </p>

    <!-- Забули пароль -->
    <div class="mt-[15px] text-left">
      <button @click="$emit('forgot')"
        class="bg-transparent border-none underline text-main cursor-pointer text-sm p-0 transition-opacity hover:opacity-80">
        Забув(
      </button>
    </div>

    <!-- Головна кнопка -->
    <button
      class="w-full bg-plum hover:bg-plum-hover text-white p-4 rounded-[24px] border-none font-bold mt-5 cursor-pointer transition-opacity duration-200 hover:opacity-90"
      @click="handleLogin">
      Увійти
    </button>

    <!-- Посилання внизу -->
    <div class="text-center mt-5">
      <button @click="$emit('signup')"
        class="bg-transparent border-none underline text-main cursor-pointer transition-opacity hover:opacity-80">
        Ще не маєте акаунту? Створити
      </button>
    </div>
  </div>
</template>