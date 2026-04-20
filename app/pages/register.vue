<script setup lang="ts">
import AuthSignup from '~/components/signup.vue'
//import AuthLogin from '~/components/login.vue' 
import AuthForgotPass from '~/components/forgotpass.vue'

const authMode = ref<'login' | 'signup' | 'forgot'>('signup')

const setMode = (mode: 'login' | 'signup' | 'forgot') => {
  authMode.value = mode
}
</script>

<template>
  <div class="auth-wrapper">
    <Transition name="fade" mode="out-in">
      <div :key="authMode">
        
        <AuthSignup 
          v-if="authMode === 'signup'" 
          @switch="setMode('login')" 
        />

        <AuthLogin 
          v-else-if="authMode === 'login'" 
          @switch="setMode('signup')" 
          @forgot="setMode('forgot')"
        />

        <AuthForgotPass 
          v-else-if="authMode === 'forgot'" 
          @switch="setMode('login')" 
        />

      </div>
    </Transition>
  </div>
</template>

<style scoped>
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
  background-color: #f5f5f5;
}
</style>
