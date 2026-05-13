<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import ToolBar from './ToolBar.vue';

const config = useRuntimeConfig();
const { token, nickname } = useAuth();

const props = defineProps<{
  postId: string | number;
  initialTitle?: string;
  initialDescription?: string;
  initialContent?: string;
}>()

const writing = reactive({
  title: props.initialTitle || '',
  description: props.initialDescription || '',
  content: props.initialContent || '',
})

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

const showCancelModal = ref(false)
const isSaving = ref(false)

const updateDraft = async () => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/posts/${props.postId}/update-draft`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: writing
    });
  } catch (e) {
    alert('Помилка збереження');
  } finally {
    isSaving.value = false; 
  }
}

const publishPost = async () => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/posts/${props.postId}/publish-draft`, {
      method: 'POST',
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
      body: writing
    });
    navigateTo(`/profile/${nickname.value}`)
  } catch (e) {
    alert('Помилка публікації');
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto flex flex-col gap-6 p-6 bg-[#FDF5E6] rounded-xl shadow-sm border border-[#e5d8c1]">

    <input v-model="writing.title"
      class="text-3xl font-bold bg-transparent border-b-2 border-[#d1c4ae] focus:border-[#c2b280] outline-none py-2"
      placeholder="Заголовок" />

    <textarea v-model="writing.description" rows="3"
      class="w-full p-4 rounded-lg border border-[#d1c4ae] focus:outline-none focus:ring-1 focus:ring-[#c2b280] resize-none"
      placeholder="Короткий опис твого твору..."></textarea>

    <div class="h-[500px] border border-[#d1c4ae] bg-white rounded-lg overflow-hidden shadow-inner">
      <ToolBar :editor="editor" />

      <ClientOnly>
        <EditorContent :editor="editor" class="flex-1 p-6 overflow-y-auto" />
      </ClientOnly>
    </div>

    <div class="flex justify-between items-center">
      <button @click="showCancelModal = true" class="p-2 hover:bg-red-50 rounded-full transition-colors">
        <span class="text-2xl">✕</span>
      </button>

      <div class="flex gap-4">
        <button @click="updateDraft"
          class="px-6 py-2 border-2 border-[#c2b280] text-[#c2b280] font-bold rounded-lg hover:bg-[#c2b280] hover:text-white transition-all">
          Зберегти чернетку
        </button>
        <button @click="publishPost"
          class="px-6 py-2 bg-[#c2b280] text-white font-bold rounded-lg hover:bg-[#b1a170] transition-all shadow-md">
          Опублікувати
        </button>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40">
      <div class="bg-[#C2B280] p-8 rounded-xl text-center text-white max-w-sm shadow-2xl">
        <h3 class="text-xl font-bold mb-6">Ви впевнені, що хочете вийти?</h3>
        <div class="flex flex-col gap-3">
          <button @click="navigateTo(`/profile/${nickname}`)"
            class="w-full py-2 bg-white text-[#C2B280] rounded-lg font-bold">Так, вийти</button>
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
</style>