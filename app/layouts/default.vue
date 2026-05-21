<script setup lang="ts">
const { isLoggedIn } = useAuth();
const { startConnection, stopConnection } = useSignalR();

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    startConnection();
  } else {
    stopConnection();
  }
}, { immediate: true });
</script>

<template>
  <div class="min-h-screen">
    <navbar />
    <main class="content-area">
      <slot> </slot>
    </main>
  </div>
</template>

<style scoped>
.content-area {
  padding-top: 100px;
  padding-bottom: 50px;
  min-height: 100vh;
}
</style> 