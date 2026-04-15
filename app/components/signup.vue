<script setup lang="ts">
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const config = useRuntimeConfig();
const errorMessage = ref('');

defineEmits(['switch']);

const handleSignup = async () => {
  errorMessage.value = '';
  if (!nickname.value || !password.value || !email.value) {
    errorMessage.value = "Будь ласка, заповніть всі поля";
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
        gmail: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      }
    });
    
    console.log("Успіх:", response);
  } catch (error) {
    console.error("Помилка при реєстрації:", error);
  }
};
</script>

<template>
  <div class="auth-card">
    <div class="sign-up-tag">
    </div>

    <h1 class="title">ВІТАЮ!</h1>

    <div class="inputs-group">
      <input v-model="nickname" type="text" placeholder="Введіть нікнейм" />
      <input v-model="email" type="email" placeholder="Введіть email" />
      <input v-model="password" type="password" placeholder="Введіть пароль" />
      <input v-model="confirmPassword" type="password" placeholder="Введіть пароль ще раз" />
    </div>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    <button class="main-btn" @click="handleSignup">Зареєструватися</button>

    <div class="footer-link">
      <button @click="$emit('switch')">Вже маю обліковий запис</button>
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
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.sign-up-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6E2C4F;
  font-weight: bold;
  font-size: 14px;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #6E2C4F;
  transform: rotate(45deg);
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

.error-text {
  color: #d9534f;
  background-color: #fce8e8;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
  border: 1px solid #d9534f;
}

input {
  padding: 16px 24px;
  border-radius: 16px;
  border: none;
  background: white;
  font-size: 16px;
}

.main-btn {
  width: 100%;
  background-color: #432534;
  color: white;
  padding: 16px;
  border-radius: 24px;
  border: none;
  font-weight: bold;
  margin-top: 30px;
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
  font-weight: 500;
}

button {
  margin-top: 5px;
}
</style>