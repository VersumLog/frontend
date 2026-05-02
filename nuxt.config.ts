// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: 'https://localhost:7014',
      isProd: !import.meta.dev
    }
  },

  css: [
    '@/assets/css/main.css'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon']
})