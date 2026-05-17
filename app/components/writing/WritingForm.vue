<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus' 
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import ToolBar from './ToolBar.vue'
import { DescriptionMark } from './description' 

const config = useRuntimeConfig()
const { token, nickname, isLoggedIn } = useAuth()
const errorMessage = ref('')

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

const editor = useEditor({
  content: props.initialContent || '',
  extensions: [
    Underline,
    StarterKit.configure({
      heading: {
        levels: [1, 2],
      },
    }),
    DescriptionMark,
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


const descriptionInput = ref('')
const isEditing = ref(false)

const currentDescription = computed(() => {
  if (!editor.value) return ''
  return editor.value.getAttributes('description').text || ''
})

watch(currentDescription, (newVal) => {
  descriptionInput.value = newVal
  if (!newVal) isEditing.value = false
})

const handleSaveDescription = () => {
  if (!editor.value || !descriptionInput.value.trim()) return
  editor.value.chain().focus().setDescription(descriptionInput.value.trim()).run()
  isEditing.value = false
}

const handleRemoveDescription = () => {
  if (!editor.value) return
  editor.value.chain().focus().unsetDescription().run()
  descriptionInput.value = ''
  isEditing.value = false
}

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

onMounted(async () => {
  if (!isLoggedIn.value) {
    navigateTo('/register');
    return;
  }
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
        <div class="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-plum-scroll [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-plum-scroll-hover">
          
          <BubbleMenu
            v-if="editor"
            :editor="editor"
            :tippy-options="{ duration: 150, placement: 'top' }"
            class="z-50"
          >
            <div class="flex items-center gap-2 bg-cream border-2 border-cream-input shadow-xl p-2 rounded-xl max-w-[90vw] sm:max-w-md">
              
              <template v-if="currentDescription && !isEditing">
                <div class="flex items-center gap-2 px-2 py-1 max-w-[180px] sm:max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-main text-sm">
                  <Icon name="lucide:notebook-tabs" class="text-plum flex-shrink-0 w-4 h-4" />
                  <span class="truncate font-medium text-xs">{{ currentDescription }}</span>
                </div>
                <button @click="isEditing = true" class="p-1 text-main hover:bg-plum/10 rounded-lg transition-colors">
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button @click="handleRemoveDescription" class="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </template>

              <template v-else>
                <input
                  v-model="descriptionInput"
                  type="text"
                  placeholder="Додати опис до слова..."
                  class="px-3 py-1 text-sm bg-input-bg text-main rounded-lg border border-cream-input focus:outline-none focus:border-mint w-40 sm:w-56"
                  @keydown.enter="handleSaveDescription"
                />
                <button 
                  @click="handleSaveDescription" 
                  class="p-1 bg-mint text-white hover:bg-mint-dark rounded-lg transition-colors"
                  :disabled="!descriptionInput.trim()"
                >
                  <Icon name="lucide:check" class="w-4 h-4" />
                </button>
                <button v-if="currentDescription" @click="isEditing = false" class="p-1 bg-cream-light text-main rounded-lg transition-colors">
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </template>
            </div>
          </BubbleMenu>

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
.has-description {
  background-color: var(--color-plum-light, rgba(221, 214, 254, 0.4)); 
  border-bottom: 2px dashed var(--color-plum, #6d28d9);
  border-radius: 2px;
  cursor: help;
  transition: background-color 0.2s ease;
}

.has-description:hover {
  background-color: var(--color-mint-light, rgba(52, 211, 153, 0.3));
}

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