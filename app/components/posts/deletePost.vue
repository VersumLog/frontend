<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const close = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <Transition 
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" 
      @click.self="close"
    >
      <Transition 
        enter-active-class="transition duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div 
          v-if="isOpen"
          class="relative w-full max-w-xl overflow-hidden rounded-md border-4 border-plum-light bg-mauve p-10 shadow-2xl"
        >
          <!-- Заголовок -->
          <h3 class="mb-12 text-center text-[1.4rem] font-medium text-black leading-snug">
            Ви справді хочете видалити цей твір?
          </h3>

          <!-- Контейнер для кнопок -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            
            <!-- Кнопка "Так" -->
            <button 
              @click="confirm"
              class="min-w-[160px] rounded-md border-[3px] border-mint-dark bg-mint-hover px-8 py-2.5 text-[1.1rem] font-bold text-white transition-all hover:bg-mint-hover hover:scale-105 active:scale-95 focus:outline-none"
            >
              Так
            </button>
            
            <!-- Кнопка "Скасувати" -->
            <button 
              @click="close"
              class="min-w-[160px] rounded-md border-[3px] border-mint-dark bg-mint-hover px-8 py-2.5 text-[1.1rem] font-bold text-white transition-all hover:bg-mint-hover hover:scale-105 active:scale-95 focus:outline-none"
            >
              Скасувати
            </button>

          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>