<script setup lang="ts">
import AuthSignup from '~/components/signup.vue'

const authMode = ref<'login' | 'signup'>('signup')

const toggleMode = () => {
  authMode.value = authMode.value === 'login' ? 'signup' : 'login'
}
</script>

<template>
  <div class="auth-wrapper">
    <Transition name="fade" mode="out-in">
      <div :key="authMode">
        <AuthSignup v-if="authMode === 'signup'" @switch="toggleMode" />
        <AuthLogin v-else @switch="toggleMode" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Анімація */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5; /* Тло сторінки */
}
</style>