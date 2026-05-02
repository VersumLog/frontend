<script setup lang="ts">

const authMode = ref<'login' | 'signup' | 'forgot'>('signup')

const setMode = (mode: 'login' | 'signup' | 'forgot') => {
  authMode.value = mode
}
</script>

<template>
  <div class="auth-wrapper">
    <Transition name="fade" mode="out-in">
      <div class="w-full" :key="authMode">
        
        <Signup 
          v-if="authMode === 'signup'" 
          @login="setMode('login')" 
        />

        <Login 
          v-else-if="authMode === 'login'" 
          @signup="setMode('signup')" 
          @forgot="setMode('forgot')"
        />

        <Forgotpass 
          v-else-if="authMode === 'forgot'" 
          @signup="setMode('signup')" 
          @login="setMode('login')" 
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
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
