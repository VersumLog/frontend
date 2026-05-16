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
  <div v-if="editor" class="flex flex-wrap gap-1 p-2 bg-cream-light border-b-2 border-cream-input rounded-t-xl">
    
    <button
      type="button"
      @click="editor.chain().focus().toggleBold().run()"
      class="p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[36px] h-9 outline-none"
      :class="editor.isActive('bold') ? 'bg-plum text-white font-bold shadow-sm' : 'text-main hover:bg-plum-light/10'"
      title="Жирний"
    >
      <Icon name="lucide:bold" class="w-4 h-4" />
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleItalic().run()"
      class="p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[36px] h-9 outline-none"
      :class="editor.isActive('italic') ? 'bg-plum text-white font-bold shadow-sm' : 'text-main hover:bg-plum-light/10'"
      title="Курсив"
    >
      <Icon name="lucide:italic" class="w-4 h-4" />
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleUnderline().run()"
      class="p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[36px] h-9 outline-none"
      :class="editor.isActive('underline') ? 'bg-plum text-white font-bold shadow-sm' : 'text-main hover:bg-plum-light/10'"
      title="Підкреслений"
    >
      <Icon name="lucide:underline" class="w-4 h-4" />
    </button>

    <div class="w-px h-6 bg-cream-input mx-1.5 self-center" />

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      class="p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[36px] h-9 outline-none"
      :class="editor.isActive('heading', { level: 1 }) ? 'bg-plum text-white font-bold shadow-sm' : 'text-main hover:bg-plum-light/10'"
      title="Заголовок 1"
    >
      <Icon name="lucide:heading-1" class="w-4 h-4" />
    </button>

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      class="p-2 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[36px] h-9 outline-none"
      :class="editor.isActive('heading', { level: 2 }) ? 'bg-plum text-white font-bold shadow-sm' : 'text-main hover:bg-plum-light/10'"
      title="Заголовок 2"
    >
      <Icon name="lucide:heading-2" class="w-4 h-4" />
    </button>

    <button
      type="button"
      @click="editor.chain().focus().setParagraph().run()"
      class="px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer h-9 outline-none"
      :class="editor.isActive('paragraph') ? 'bg-plum text-white shadow-sm' : 'text-main hover:bg-plum-light/10'"
    >
      <Icon name="lucide:text" class="w-4 h-4" />
      <span>Текст</span>
    </button>
  </div>
</template>