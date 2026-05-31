<script setup lang="ts">
import { ref } from 'vue';

const config = useRuntimeConfig();
const emit = defineEmits(['signup', 'login']);

const currentStep = ref<'forgot' | 'code' | 'renew'>('forgot');

const email = ref('');
const verificationCode = ref(['', '', '', '', '', '']);
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const codeInputs = ref<HTMLInputElement[]>([]);

const handleInput = (index: number) => {
  if (verificationCode.value[index] && index < 5) {
    codeInputs.value[index + 1]?.focus();
  }
};

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const data = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6);
  if (data) {
    data.split('').forEach((char, i) => {
      verificationCode.value[i] = char;
    });
    codeInputs.value[data.length - 1]?.focus();
  }
};

const handleSendEmail = async () => {
  errorMessage.value = '';
  try {
    await $fetch(`${config.public.apiBase}/api/Auth/forgot-password`, {
      method: 'POST',
      body: { email: email.value }
    });
    currentStep.value = 'code';
  } catch (error: any) {
    errorMessage.value = error.data?.message || "Помилка при запиті";
  }
};

const goToRenew = async () => {
  const codeString = verificationCode.value.join('');
  if (codeString.length < 6) {
    errorMessage.value = "Введіть повний код (6 цифр)";
    return;
  }
  try {
    await $fetch(`${config.public.apiBase}/api/Auth/reset-password-token-check`, {
      method: 'POST',
      body: {
        token: codeString,
        email: email.value
      }
    });
    errorMessage.value = '';
    currentStep.value = 'renew';
  } catch (error: any) {
    errorMessage.value = error.data?.message || "Помилка при запиті";
  }
};

const handleResetPassword = async () => {
  errorMessage.value = '';
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Паролі не збігаються";
    return;
  }

  try {
    const codeString = verificationCode.value.join('');
    await $fetch(`${config.public.apiBase}/api/Auth/reset-password`, {
      method: 'POST',
      body: {
        token: codeString,
        newPassword: password.value,
        email: email.value
      }
    });

    alert("Пароль успішно змінено!");
    emit('login');
  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else {
      errorMessage.value = error.data?.message || "Не вдалося змінити пароль";
    }
  }
};
</script>

<template>
  <div
    class="w-[80%] lg:w-[30vw] mx-auto bg-cream-dark p-10 rounded-[32px] relative shadow-[0_10px_30px_rgba(0,0,0,0.08)] font-sans">

    <!-- Плавна зміна кроків -->
    <Transition mode="out-in" enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in" enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <!-- Крок 1: Введення Email -->
      <div v-if="currentStep === 'forgot'" class="flex flex-col">
        <h3 class="text-center text-[15px] font-semibold leading-[1.4] mb-6 text-main">
          Будь ласка, введіть адресу електронної пошти
        </h3>
        <div class="flex flex-col gap-3">
          <input v-model="email" type="email" placeholder="Емейл"
            class="w-full py-4 px-6 rounded-2xl border-2 border-plum-light bg-input-bg text-base box-border transition-all duration-200 focus:outline focus:border-mint focus:outline-2 focus:outline-plum" />
        </div>
        <p v-if="errorMessage" class="text-[#c9302c] text-[13px] text-center mt-2.5 font-medium">{{ errorMessage }}</p>

        <button
          class="w-full bg-plum hover:bg-plum-hover text-white p-4 rounded-[20px] border-none mt-6 font-bold cursor-pointer transition-all duration-300 hover:bg-plum-scroll hover:-translate-y-[1px] active:translate-y-0"
          @click="handleSendEmail">
          Відновити пароль
        </button>

        <div class="text-center mt-5">
          <button @click="$emit('signup')"
            class="bg-transparent border-none underline text-main cursor-pointer text-sm font-semibold hover:opacity-80 transition-opacity">
            Немає облікового запису?
          </button>
        </div>
      </div>

      <!-- Крок 2: Введення 6-значного коду -->
      <div v-else-if="currentStep === 'code'" class="flex flex-col">
        <h3 class="text-center text-[15px] font-semibold leading-[1.4] mb-6 text-main">
          Введіть 6-значний код з вашої пошти
        </h3>

        <div class="flex justify-between gap-2">
          <input v-for="(n, index) in 6" :key="index" ref="codeInputs" v-model="verificationCode[index]" type="text"
            maxlength="1" @input="handleInput(index)" @keydown="handleKeydown($event, index)"
            @paste.prevent="handlePaste"
            class="w-full aspect-square text-center rounded-xl border-2 border-plum-light bg-input-bg text-main text-xl font-bold transition-all duration-200 focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20" />
        </div>

        <p v-if="errorMessage" class="text-red-600 text-[13px] text-center mt-2.5 font-medium">
          {{ errorMessage }}
        </p>

        <button
          class="w-full bg-plum text-white p-4 rounded-[20px] border-none mt-6 font-bold cursor-pointer transition-all duration-300 hover:bg-plum-hover hover:-translate-y-[1px] active:translate-y-0"
          @click="goToRenew">
          Підтвердити код
        </button>
      </div>

      <!-- Крок 3: Введення нового пароля -->
      <div v-else-if="currentStep === 'renew'" class="flex flex-col">
        <h3 class="text-center text-[15px] font-semibold leading-[1.4] mb-6 text-main">
          Придумайте новий пароль
        </h3>
        <div class="flex flex-col gap-3">
          <input v-model="password" type="password" placeholder="Новий пароль"
            class="p-4 rounded-[14px] border-none bg-white text-base outline-none transition-all focus:ring-2 focus:ring-plum-scroll-hover/25" />
          <input v-model="confirmPassword" type="password" placeholder="Повторіть пароль"
            class="p-4 rounded-[14px] border-none bg-white text-base outline-none transition-all focus:ring-2 focus:ring-plum-scroll-hover/25" />
        </div>
        <p v-if="errorMessage" class="text-[#c9302c] text-[13px] text-center mt-2.5 font-medium">{{ errorMessage }}</p>

        <button
          class="w-full bg-plum hover:bg-plum-hover text-white p-4 rounded-[20px] border-none mt-6 font-bold cursor-pointer transition-all duration-300 hover:bg-plum-scroll hover:-translate-y-[1px] active:translate-y-0"
          @click="handleResetPassword">
          Зберегти пароль
        </button>
      </div>
    </Transition>

  </div>
</template>