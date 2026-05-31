export const useAuth = () => {
  const config = useRuntimeConfig();

  const token = useCookie('auth_token', {
    maxAge: 60 * 1440, // 24 hours
    sameSite: 'lax',
    secure: config.public.isProd,
  });
  
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