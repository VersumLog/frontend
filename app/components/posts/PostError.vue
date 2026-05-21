<script setup lang="ts">
defineProps<{
    errorMessage: string;
}>();

const emit = defineEmits<{
    (e: 'retry'): void;
}>();
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div class="bg-white/50 p-12 rounded-[40px] border-2 border-dashed border-plum-light/20 max-w-lg w-full">
            <span class="text-6xl mb-6 block">📑</span>

            <h2 class="text-3xl font-black text-plum-light mb-2">Сталася помилка</h2>
            <p class="text-plum-light/70 mb-8">
                {{ errorMessage }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button @click="emit('retry')"
                    class="bg-plum-light text-white px-8 py-4 rounded-2xl font-bold hover:bg-plum-scroll-hover transition-all shadow-lg">
                    Спробувати ще раз
                </button>
                <button @click="navigateTo('/')"
                    class="bg-transparent border-2 border-plum-light text-plum-light px-8 py-4 rounded-2xl font-bold hover:bg-plum-light/5 transition-all">
                    На головну
                </button>
            </div>
        </div>
    </div>
</template>