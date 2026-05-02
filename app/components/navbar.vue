<script setup lang="ts">
const { isLoggedIn, nickname } = useAuth();

const profilePath = computed(() => {
  return isLoggedIn.value ? `/profile/${nickname.value}` : '/register'
});
</script>

<template>
  <nav class="navbar fixed top-0 left-0 w-full z-50">
    <div class="nav-content">

      <NuxtLink to="/" class="logo-box flex-shrink-0">
        <img src="/logo.png" alt="Versum" class="logo-img" />
      </NuxtLink>

      <div class="search-container hidden lg:flex">
        <input type="text" placeholder="Пошук" class="search-input" />
      </div>

      <div class="nav-icons">
        <NuxtLink to="/saved" class="nav-item">
          <Icon name="lucide:bookmark" class="icon-svg" />
          <span class="nav-label">Збережене</span>
        </NuxtLink>

        <NuxtLink to="/dictionary" class="nav-item">
          <Icon name="lucide:book-open" class="icon-svg" />
          <span class="nav-label">Словник</span>
        </NuxtLink>

        <NuxtLink to="/notifications" class="nav-item relative">
          <Icon name="lucide:bell" class="icon-svg" />
          <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#744458]"></span>
          <span class="nav-label">Сповіщення</span>
        </NuxtLink>

        <NuxtLink :to="profilePath" class="nav-item" active-class="active">
          <Icon name="lucide:user" class="icon-svg" />
          <span class="nav-label">
            {{ isLoggedIn ? 'Профіль' : 'Увійти' }}
          </span>
        </NuxtLink>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--bg-navbar);
  padding: 15px 0;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-content {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
}

@media (min-width: 1024px) {
  .nav-content {
    padding-left: 40px;
    padding-right: 60px;
  }
}

.logo-box {
  background: #e9c99d;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

@media (min-width: 1280px) {
  .logo-box {
    margin-right: 150px;
  }
}

.logo-img {
  width: 45px;
}

.search-container {
  flex: 1;
  display: flex;
}

@media (min-width: 1440px) {
  .search-container {
    margin-right: 300px;
  }
}

.search-input {
  width: 100%;
  padding: 14px 25px;
  border-radius: 6px;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  outline: none;
}

.nav-icons {
  display: flex;
  gap: 20px;
  color: white;
}

@media (min-width: 768px) {
  .nav-icons {
    gap: 55px;
    margin-left: 20px;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  transition: opacity 0.2s;
}

.nav-item:hover {
  opacity: 0.8;
}

.nav-item.active {
  color: #e9c99d;
}

.nav-label {
  font-size: 12px;
  font-weight: 600;
  margin-top: 5px;
}

@media (max-width: 640px) {
  .nav-label {
    display: none;
  }

  .logo-box {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .logo-img {
    width: 35px;
  }
}
</style>