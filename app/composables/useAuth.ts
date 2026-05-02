export const useAuth = () => {
  const token = useCookie('auth_token');
  const nickname = useCookie('user_nickname');

  const isLoggedIn = computed(() => !!token.value);

  const logout = () => {
    token.value = null;
    nickname.value = null;
    navigateTo('/register');
  };

  return {
    token,
    nickname,
    isLoggedIn,
    logout
  };
};