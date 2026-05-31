<script setup lang="ts">
defineProps<{
    postId?: string;
}>();
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-cream rounded-[40px]">
        <div class="relative flex items-center justify-center">
            <div class="absolute animate-ping h-20 w-20 rounded-full bg-plum-light opacity-10"></div>
            <div
                class="relative rounded-full h-14 w-14 border-4 border-plum border-t-[var(--color-plum-light)] animate-spin">
            </div>
            <span class="absolute text-xl animate-spin">
                <Icon name="tabler:file-search" class="w-12 h-12 text-plum" />
            </span>
        </div>

        <div class="text-center space-y-3">
            <h3 class="text-2xl font-black text-plum tracking-tight animate-pulse">
                Шукаємо твір...
            </h3>
            <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-plum-light/5 border border-plum-light/10">
                <span class="text-plum font-semibold text-sm">
                    ID запису: <span class="font-mono">#{{ postId || "error"}}</span>
                </span>
            </div>
        </div>

        <div class="flex gap-2">
            <div class="h-2 w-2 rounded-full bg-plum animate-bounce [animation-delay:-0.3s]"></div>
            <div class="h-2 w-2 rounded-full bg-plum animate-bounce [animation-delay:-0.15s]"></div>
            <div class="h-2 w-2 rounded-full bg-plum animate-bounce"></div>
        </div>
    </div>
</template>