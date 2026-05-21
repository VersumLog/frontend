<script setup lang="ts">
const props = defineProps<{
  word: string;
  description: string;
  postId: string | number;
  anchorId: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();
const config = useRuntimeConfig();
const { token } = useAuth();


const isAdding = ref(false);
const isSavedSuccessfully = ref(false);

const addToDictionary = async () => {
  isAdding.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/dict/${props.postId}/add-phrase`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: {
        phrase: props.word,
        description: props.description,
        anchorId: props.anchorId
      }
    });
    isSavedSuccessfully.value = true;
    setTimeout(() => { isSavedSuccessfully.value = false; }, 2000);
  } catch (e) {
    console.error('Не вдалося зберегти слово:', e);
  } finally {
    isAdding.value = false;
  }
};
</script>

<template>
  <transition appear enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 translate-y-4 scale-95"
    leave-to-class="opacity-0 translate-y-4 scale-95">
    <div v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-4 bg-black/10 backdrop-blur-[2px]"
      @click.self="emit('close')">

      <div
        class="w-full sm:max-w-md bg-cream-dark backdrop-blur-md border border-plum p-6 rounded-t-[32px] sm:rounded-[24px] shadow-2xl relative">

        <button @click="emit('close')"
          class="absolute top-4 right-4 p-1 rounded-full hover:bg-plum text-main transition-colors">
          <Icon name="lucide:x" class="w-6 h-5" />
        </button>

        <div class="flex items-start gap-3">
          <div class="p-2 text-mint rounded-xl mt-0.5">
            <Icon name="lucide:notebook-tabs" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <span class="text-xs font-bold uppercase tracking-wider text-plum block mb-0.5">Значення слова</span>
            <h4 class="text-xl font-black text-main tracking-tight mb-1">«{{ word }}»</h4>
            <p class="text-main text-sm leading-relaxed mb-6 pt-2 border-t border-plum">
              {{ description }}
            </p>

            <button @click="addToDictionary" :disabled="isAdding || isSavedSuccessfully"
              class="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              :class="isSavedSuccessfully
                ? 'bg-mint text-white'
                : 'bg-plum text-white hover:bg-plum-hover active:scale-[0.98]'">
              <Icon :name="isSavedSuccessfully ? 'lucide:check' : isAdding ? 'svg-spinners:180-ring' : 'lucide:plus'"
                class="w-4 h-4" />
              <span>{{ isSavedSuccessfully ? 'Збережено в словник!' : isAdding ? 'Зберігаємо...' : 'Додати до словника'
                }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>