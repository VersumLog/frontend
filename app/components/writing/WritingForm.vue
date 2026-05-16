<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import ToolBar from './ToolBar.vue';

const config = useRuntimeConfig();
const { token, nickname } = useAuth();
const errorMessage = ref('');

const props = defineProps<{
  postId: string | number;
  initialTitle?: string;
  initialDescription?: string;
  initialContent?: string;
  initialGenre?: string;
}>()

const writing = reactive({
  title: props.initialTitle || '',
  description: props.initialDescription || '',
  content: props.initialContent || '',
  genres: props.initialGenre ? [props.initialGenre] : [] as string[],
})

const genres = ref<string[]>([]);
const isGenreOpen = ref(false);

onMounted(async () => {
  try {
    const data = await $fetch<string[]>(`${config.public.apiBase}/api/posts/get-genres`);
    genres.value = data;
  } catch (e) {
    console.error('Помилка завантаження жанрів', e);
  }
  try {
    const draftData = await $fetch<any>(`${config.public.apiBase}/api/posts/${props.postId}`, {
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
    });

    if (draftData) {
      writing.title = draftData.title || '';
      writing.description = draftData.description || '';
      writing.genres = draftData.genres || [];
      writing.content = draftData.content || '';

      if (editor.value) {
        editor.value.commands.setContent(draftData.content || '');
      }
    }
  } catch (e) {
    console.error('Помилка завантаження чернетки', e);
  }
});

const selectGenre = (genre: string) => {
  writing.genres = [genre];
  isGenreOpen.value = false;
};

const editor = useEditor({
  content: props.initialContent || '',
  extensions: [
    Underline,
    StarterKit.configure({
      heading: {
        levels: [1, 2],
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-stone max-w-none focus:outline-none min-h-[400px]',
    },
  },
  onUpdate: ({ editor }) => {
    writing.content = editor.getHTML()
  },
})

watch(() => props.initialContent, (newContent) => {
  if (editor.value && newContent !== editor.value.getHTML()) {
    editor.value.commands.setContent(newContent || '');
    writing.content = newContent || '';
  }
}, { immediate: true });

watch(() => props.initialTitle, (newTitle) => {
  writing.title = newTitle || '';
});

watch(() => props.initialGenre, (newGenre) => {
  writing.genres = newGenre ? [newGenre] : [];
});

const showCancelModal = ref(false)
const isSaving = ref(false)
const showSuccessMessage = ref(false)

const updateDraft = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  try {
    await $fetch(`${config.public.apiBase}/api/posts/${props.postId}/update-draft`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: writing
    });

    showSuccessMessage.value = true;

    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 2000);

  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else {
      errorMessage.value = error.data?.message || "Не вдалося створити твір";
    }
  } finally {
    isSaving.value = false;
  }
}

const publishPost = async () => {
  isSaving.value = true;
  await updateDraft()
  try {
    await $fetch(`${config.public.apiBase}/api/posts/${props.postId}/publish-draft`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: writing
    });
    navigateTo(`/profile/${nickname.value}`)
  } catch (error: any) {
    if (error.data?.errors) {
      errorMessage.value = Object.values(error.data.errors).flat()[0] as string;
    } else {
      errorMessage.value = error.data?.message || "Не вдалося створити твір";
    }
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto flex flex-col gap-6 p-6 bg-cream-dark rounded-xl shadow-sm border border-cream-input">

    <div class="relative self-start">
      <div 
        @click="isGenreOpen = !isGenreOpen"
        class="cursor-pointer px-4 py-1.5 rounded-full border-2 border-plum text-plum font-bold text-sm hover:bg-plum hover:text-white transition-all flex items-center gap-2 active:scale-95"
      >
        <span>{{ writing.genres[0] || 'Обрати жанр' }}</span>
        <Icon 
          name="lucide:chevron-down" 
          class="w-4 h-4 transition-transform duration-200" 
          :class="{ 'rotate-180': isGenreOpen }" 
        />
      </div>

      <transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 translate-y-1"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div 
          v-if="isGenreOpen"
          class="absolute top-full left-0 mt-2 w-48 bg-input-bg border-2 border-cream-input rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-plum-scroll/40 [&::-webkit-scrollbar-thumb]:rounded"
        >
          <div 
            v-for="genre in genres" 
            :key="genre" 
            @click="selectGenre(genre)"
            class="px-4 py-2.5 hover:bg-cream-light cursor-pointer text-main font-medium transition-colors border-b border-cream-input last:border-0"
          >
            {{ genre }}
          </div>
        </div>
      </transition>
    </div>

    <input 
      v-model="writing.title"
      type="text"
      class="text-3xl font-black bg-transparent border-b-2 border-cream-input text-main placeholder:text-muted/40 focus:border-mint focus:outline-none py-2 transition-colors duration-200"
      placeholder="Заголовок" 
    />

    <textarea 
      v-model="writing.description" 
      rows="3"
      class="w-full p-4 rounded-xl border-2 border-cream-input bg-input-bg text-main placeholder:text-muted/50 focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 resize-none transition-all duration-200"
      placeholder="Короткий опис твого твору..."
    ></textarea>

    <div class="h-[500px] border-2 border-cream-input bg-input-bg rounded-xl overflow-hidden shadow-sm flex flex-col">

      <div class="sticky top-0 z-10 bg-cream-light border-b-2 border-cream-input">
        <ToolBar :editor="editor" />
      </div>

      <ClientOnly>
        <div class="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-plum-scroll [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-plum-scroll-hover">
          <EditorContent :editor="editor" class="p-6 min-h-full bg-input-bg text-main focus:outline-none" />
        </div>
      </ClientOnly>

    </div>

    <div class="flex justify-between items-center">
      <button @click="showCancelModal = true" class="p-2 hover:bg-red-50 rounded-full transition-colors">
        <span class="text-2xl">✕</span>
      </button>

      <Transition name="toast">
        <div v-if="showSuccessMessage"
          class="fixed bottom-8 right-8 z-[120] bg-muted text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 border border-muted">

          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-medium">Чернетку успішно збережено!</span>
        </div>
      </Transition>

      <div class="flex gap-4">
        <button @click="updateDraft"
          class="px-6 py-2 border-2 border-cream-dark text-muted font-bold rounded-lg hover:bg-cream-dark hover:text-white transition-all">
          Зберегти чернетку
        </button>
        <button 
        @click="publishPost"
          class="px-6 py-2 bg-cream-dark text-white font-bold rounded-lg hover:bg-cream-dark hover:text-main transition-all shadow-md">
          Опублікувати
        </button>
      </div>
    </div>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

    <div v-if="showCancelModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-cream-dark p-8 rounded-xl text-center text-white max-w-sm shadow-2xl">
        <h3 class="text-xl font-bold mb-6">Ви впевнені, що хочете вийти?</h3>
        <div class="flex flex-col gap-3">
          <button @click="navigateTo(`/profile/${nickname}`)"
            class="w-full py-2 bg-white text-cream-dark rounded-lg font-bold">Так, вийти</button>
          <button @click="showCancelModal = false" class="w-full py-2 border border-white rounded-lg">Скасувати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.tiptap:focus {
  outline: none;
}

.tiptap h1 {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.tiptap h2 {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.8rem;
}

.tiptap {
  outline: none !important;
}

.tiptap p {
  margin-bottom: 0.5rem;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>