<script setup lang="ts">
import { ref } from 'vue';
const errorMessage = ref('');
const config = useRuntimeConfig();

const email = ref('');
const password = ref('');

defineEmits(['switch', 'forgot-password']);

const handleLogin = async () => {
  errorMessage.value = '';
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
  } catch (error) {
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
      <input v-model="email" type="email" placeholder="Ваш email" />
      <input v-model="password" type="password" placeholder="Пароль" />
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

input {
  padding: 16px 24px;
  border-radius: 16px;
  border: none;
  background: white;
  font-family: inherit;
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