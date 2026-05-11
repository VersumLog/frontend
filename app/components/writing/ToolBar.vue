<script setup lang="ts">
const props = defineProps<{
  editor: any
}>()

const isActive = (name: string, attributes = {}) => {
  return props.editor?.isActive(name, attributes) 
    ? 'bg-orange-100 text-orange-600 border-orange-200' 
    : 'hover:bg-gray-100 text-gray-700 border-transparent'
}
</script>

<template>
  <div v-if="editor" class="flex flex-wrap gap-1 p-2 bg-white border-b border-gray-200 rounded-t-lg">
    <button
      type="button"
      @click="editor.chain().focus().toggleBold().run()"
      :class="['px-3 py-1.5 rounded border transition-colors font-bold', isActive('bold')]"
    >
      B
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleItalic().run()"
      :class="['px-3 py-1.5 rounded border transition-colors italic', isActive('italic')]"
    >
      I
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleUnderline().run()"
      :class="['px-3 py-1.5 rounded border transition-colors underline', isActive('underline')]"
    >
      U
    </button>

    <div class="w-px h-6 bg-gray-300 mx-1 self-center" />

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="['px-3 py-1.5 rounded border transition-colors font-black', isActive('heading', { level: 1 })]"
    >
      H1
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="['px-3 py-1.5 rounded border transition-colors font-bold', isActive('heading', { level: 2 })]"
    >
      H2
    </button>

    <button
      type="button"
      @click="editor.chain().focus().setParagraph().run()"
      class="px-3 py-1.5 rounded border border-transparent hover:bg-gray-100 text-gray-700 transition-colors"
    >
      Текст
    </button>
  </div>
</template>