<script setup lang="ts">
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const config = useRuntimeConfig();
const errorMessage = ref('');
const successMessage = ref('');

const isNicknameTaken = ref(false);

defineEmits(['login']);

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
  <div class="auth-card">
    <div class="sign-up-tag"></div>

    <h1 class="title">ВІТАЮ!</h1>

    <div class="inputs-group">
      <input 
        v-model="nickname" 
        type="text" 
        placeholder="Введіть нікнейм(малими літерами)" 
        :class="{ 'input-error-border': isNicknameTaken }"
        @input="isNicknameTaken = false" 
      />
      <input v-model="email" type="email" placeholder="Введіть email" />
      <input v-model="password" type="password" placeholder="Введіть пароль" />
      <input v-model="confirmPassword" type="password" placeholder="Введіть пароль ще раз" />
    </div>

    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    
    <p v-if="successMessage" class="success-text"> {{ successMessage }}</p>

    <button class="main-btn" @click="handleSignup">Зареєструватися</button>

    <div class="footer-link">
      <button @click="$emit('login')">Вже маю обліковий запис</button>
    </div>
  </div>
</template>

<style scoped>
.input-error-border {
  outline: 2px solid #d9534f !important;
  border: 1px solid #d9534f !important;
}

.auth-card {
  background-color: #EFD6AC;
  padding: 40px;
  border-radius: 32px;
  width: 450px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
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
  margin-top: 15px;
  border: 1px solid #d9534f;
}

.success-text{
  color:#28a745;
  background-color:#eafaf1;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
  border: 1px solid #28a745;
  font-weight: 500;
}

input {
  padding: 16px 24px;
  border-radius: 16px;
  border: 1px solid transparent;
  background: white;
  font-size: 16px;
  transition: all 0.2s ease;
}

input:focus {
  outline: 2px solid #432534;
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
  transition: opacity 0.2s;
}

.main-btn:hover {
  opacity: 0.9;
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
</style>