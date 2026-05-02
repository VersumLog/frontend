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
  <div class="auth-card w-[80%] lg:w-[30vw] mx-auto">
    <div v-if="currentStep === 'forgot'" class="step-container">
      <h3 class="subtitle">Будь ласка, введіть адресу електронної пошти</h3>
      <div class="inputs-group">
        <input v-model="email" type="email" placeholder="Емейл" />
      </div>
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <button class="main-btn" @click="handleSendEmail">Відновити пароль</button>
      <div class="footer-link">
        <button @click="$emit('signup')">Немає облікового запису?</button>
      </div>
    </div>

    <div v-if="currentStep === 'code'" class="step-container">
      <h3 class="subtitle">Введіть 6-значний код з вашої пошти</h3>
      <div class="code-inputs-group">
        <input v-for="(n, index) in 6" :key="index" ref="codeInputs" v-model="verificationCode[index]" type="text"
          maxlength="1" @input="handleInput(index)" @keydown="handleKeydown($event, index)" @paste.prevent="handlePaste"
          class="code-input" />
      </div>
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <button class="main-btn" @click="goToRenew">Підтвердити код</button>
    </div>

    <div v-if="currentStep === 'renew'" class="step-container">
      <h3 class="subtitle">Придумайте новий пароль</h3>
      <div class="inputs-group">
        <input v-model="password" type="password" placeholder="Новий пароль" />
        <input v-model="confirmPassword" type="password" placeholder="Повторіть пароль" />
      </div>
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <button class="main-btn" @click="handleResetPassword">Зберегти пароль</button>
    </div>
  </div>
</template>

<style scoped>
.auth-card {
  background-color: #EFD6AC;
  padding: 40px;
  border-radius: 32px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.subtitle {
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 25px;
  color: #04151F;
}

.error-text {
  color: #c9302c;
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
}

.inputs-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: white;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.2s ease;
}

input:focus {
  box-shadow: 0 0 0 2px #61344B44;
}

.code-inputs-group {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.code-input {
  width: 45px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  background: white;
  padding: 0;
}

.main-btn {
  width: 100%;
  background-color: #61344B;
  color: white;
  padding: 16px;
  border-radius: 20px;
  border: none;
  margin-top: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.main-btn:hover {
  background-color: #4a2739;
  transform: translateY(-1px);
}

.main-btn:active {
  transform: translateY(0);
}

.footer-link {
  text-align: center;
  margin-top: 20px;
}

.footer-link button {
  background: none;
  border: none;
  text-decoration: underline;
  color: #04151F;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}
</style>