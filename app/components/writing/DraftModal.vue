<script setup lang="ts">
const config = useRuntimeConfig();
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])
const { token, nickname } = useAuth();
const errorMessage = ref('');

const title = ref('')
const isLoading = ref(false)

const saveDraft = async () => {
  if (!title.value || title.value.length < 3) {
    errorMessage.value = "Введіть заголовок (мін. 3 символи)";
    return;
  }

  isLoading.value = true;
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/api/posts/create-draft`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: { title: title.value }
    });
    emit('close');
    await navigateTo(`/write/${response.postId}`);
  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else {
      errorMessage.value = error.data?.message || "Не вдалося створити твір";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')"></div>
    
    <div class="relative bg-[#FDF5E6] w-full max-w-md p-8 rounded-2xl shadow-2xl border border-[#e5d8c1]">
      <h3 class="text-2xl font-serif font-bold mb-6 text-gray-800">Новий твір</h3>
      
      <input 
      v-model="title" 
      type="text"
      placeholder="Введіть заголовок..." 
      class="w-full p-3 rounded-lg border border-[#d1c4ae] bg-white focus:outline-none focus:ring-2 focus:ring-[#c2b280] mb-8"
      autofocus
      />
      
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <div class="flex justify-end gap-3">
        <button 
          @click="emit('close')" 
          class="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          :disabled="isLoading"
        >
          Скасувати
        </button>
        <button 
        @click="saveDraft" 
        class="px-6 py-2 rounded-lg bg-[#c2b280] text-white font-medium hover:bg-[#b1a170] disabled:opacity-50 transition-colors"
        :loading="isLoading"
        >
        {{ isLoading ? 'Збереження...' : 'Продовжити' }}
      </button>
      </div>
    </div>
  </div>
</template>