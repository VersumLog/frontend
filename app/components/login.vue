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

defineEmits(['switch', 'forgot-password']);

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

  try {
    const response = await $fetch(`${config.public.apiBase}/api/Auth/login`, {
      method: 'POST',
      body: {
        username: email.value,
        password: password.value
      }
    });
    
   console.log("Успіх:", response);
  } catch (error: any) {
    
    const status = error.status || error.response?.status;

    if (status === 400 || status === 404) {

      isEmailValid.value = false;
      if (email.value.includes('@')) {
        emailFieldError.value = "Неправильний email";
      } else {
        emailFieldError.value = "Такого імені не існує";
      }
    } else if (status === 401) {

      isPasswordValid.value = false;
      passwordFieldError.value = "Пароль неправильний";
    } else {
      errorMessage.value = "Сталася помилка при логіні. Спробуйте пізніше.";
    }
    
    console.error("Помилка при логіні:", error);
  }

};
</script>

<template>
  <div class="auth-card">
    <div class="sign-up-tag">
    </div>

    <h1 class="title">З ПОВЕРНЕННЯМ!</h1>

    <div class="inputs-group">
      <div class="input-wrapper">
        <input 
          v-model="email" 
          type="text" 
          placeholder="Введіть нікнейм або email" 
          @blur="handleEmailBlur"
          @input="emailFieldError = ''; isEmailValid = false"
          :class="{ 'valid-field': isEmailValid, 'error-border': emailFieldError }"
        />
        <span v-if="emailFieldError" class="error-msg">{{ emailFieldError }}</span>
      </div>

      <div class="input-wrapper">
        <input 
          v-model="password" 
          type="password" 
          placeholder="Пароль" 
          @blur="handlePasswordBlur"
          @input="passwordFieldError = ''; isPasswordValid = false"
          :class="{ 'valid-field': isPasswordValid, 'error-border': passwordFieldError }"
        />
        <span v-if="passwordFieldError" class="error-msg">{{ passwordFieldError }}</span>
      </div>
    </div>
    
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    
    <div class="forgot-password">
      <button @click="$emit('forgot-password')">Забув(</button>
    </div>

    <button class="main-btn" @click="handleLogin">Увійти</button>

    <div class="footer-link">
      <button @click="$emit('switch')">Ще не маєте акаунту? Створити</button>
    </div>
  </div>
</template>

<style scoped>
.auth-card {
  background-color: #EFD6AC;
  padding: 40px;
  border-radius: 32px;
  width: 450px;
  position: relative;
}

.sign-up-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #04151F;
  font-weight: bold;
  font-size: 14px;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: 900;
  color: #04151F;
  margin: 40px 0;
}

.inputs-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input {
  padding: 16px 24px;
  border-radius: 16px;
  border: 2px solid transparent;
  background: white;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.valid-field{
  border-color :#4CAF50 !important;
}

.error-border {
  border-color: #F44336 !important;
}

.error-msg {
  color: #F44336;
  font-size: 12px;
  margin-top: -10px;
  margin-left: 12px;
}
.error-text {
  color: #d9534f;
  background-color: #fce8e8;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
  border: 1px solid #d9534f;
}
.forgot-password { 
  margin-top: 15px;
  text-align: left;
}

.forgot-password button {
  background: none;
  border: none;
  text-decoration: underline;
  color: #04151F;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  padding: 0;
}

.main-btn {
  width: 100%;
  background-color: #432534;
  color: white;
  padding: 16px;
  border-radius: 24px;
  border: none;
  font-weight: bold;
  margin-top: 20px; 
  cursor: pointer;
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
  font-family: inherit;
}
</style>