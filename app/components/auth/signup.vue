<script setup lang="ts">
import { ref } from 'vue';

const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const config = useRuntimeConfig();
const errorMessage = ref('');
const successMessage = ref('');

const isNicknameTaken = ref(false);

const emit = defineEmits(['login']);

const handleSignup = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isNicknameTaken.value = false;

  if (!nickname.value || !password.value || !email.value) {
    errorMessage.value = "Будь ласка, заповніть всі поля";
    return;
  }

  if (password.value.length < 8 || password.value.length > 20) {
    errorMessage.value = "Пароль має бути не менше ніж 8 символів і не більше ніж 20";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Паролі не збігаються";
    return;
  }

  try {
    const response = await $fetch(`${config.public.apiBase}/api/Auth/register`, {
      method: 'POST',
      body: {
        username: nickname.value,
        password: password.value,
        email: email.value
      }
    });

    successMessage.value = "Реєстрація успішна! Перевірте пошту для підтвердження :)";

    nickname.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';

  } catch (error: any) {
    if (error.status === 400 || error.status === 409) {
      errorMessage.value = "Цей нікнейм чи пошта вже існує";
      isNicknameTaken.value = true;

      if (error.data?.errors) {
        errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
      } else if (error.data?.message) {
        errorMessage.value = error.data.message;
      }
    } else {
      errorMessage.value = "Сталася помилка при реєстрації. Спробуйте пізніше.";
    }

    console.error("Помилка при реєстрації:", error);
  }
};
</script>

<template>
  <div
    class="w-[80%] lg:w-[30vw] mx-auto bg-cream-dark p-10 rounded-[32px] relative shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
    <div class="sign-up-tag"></div>

    <h1 class="text-center text-[32px] font-black text-main my-10">ВІТАЮ!</h1>

    <div class="flex flex-col gap-[15px]">
      <input v-model="nickname" type="text" placeholder="Введіть нікнейм(малими літерами)"
        class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-main placeholder:text-muted/60 text-base box-border transition-all duration-200 focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 disabled:opacity-70 disabled:cursor-not-allowed"
        :class="{ '!border-red-600 !ring-red-600/20': isNicknameTaken }" @input="isNicknameTaken = false" />
      <input v-model="email" type="email" placeholder="Введіть email"
        class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-base box-border transition-all duration-200 focus:outline focus:border-mint focus:outline-2 focus:outline-plum" />
      <input v-model="password" type="password" placeholder="Введіть пароль"
        class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-base box-border transition-all duration-200 focus:outline focus:border-mint focus:outline-2 focus:outline-plum" />
      <input v-model="confirmPassword" type="password" placeholder="Введіть пароль ще раз"
        class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-base box-border transition-all duration-200 focus:outline focus:border-mint focus:outline-2 focus:outline-plum" />
    </div>

    <p v-if="errorMessage"
      class="text-[#d9534f] bg-[#fce8e8] p-2.5 rounded-lg text-center text-sm mt-[15px] border border-[#d9534f]">
      {{ errorMessage }}
    </p>

    <p v-if="successMessage"
      class="text-mint bg-mint-light p-3 rounded-lg text-center text-sm mt-[15px] border border-mint font-medium">
      {{ successMessage }}
    </p>

    <button
      class="w-full bg-plum hover:bg-plum-hover text-white p-4 rounded-3xl border-none font-bold mt-[30px] cursor-pointer transition-opacity duration-200 hover:opacity-90"
      @click="handleSignup">
      Зареєструватися
    </button>

    <div class="text-center mt-5">
      <button
        class="bg-transparent border-none underline text-main cursor-pointer font-medium hover:opacity-80 transition-opacity"
        @click="$emit('login')">
        Вже маю обліковий запис
      </button>
    </div>
  </div>
</template>