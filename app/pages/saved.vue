<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import SavedPostCard from '@/components/posts/saved/SavedPostCard.vue';
import type { PostGetDto } from '@/types/post';

const config = useRuntimeConfig();
const { token, isLoggedIn } = useAuth();

const savedPosts = ref<PostGetDto[]>([]);
const isLoading = ref(false);

// Сортування
const sortBy = ref('Title');
const sortDesc = ref(false);
const isSortMenuOpen = ref(false);

const fetchSavedPosts = async () => {
    if (!isLoggedIn.value || !token.value) return;

    isLoading.value = true;
    try {
        const baseUrl = config.public.apiBase || 'https://localhost:7014';

        savedPosts.value = await $fetch<PostGetDto[]>(`${baseUrl}/api/Savings/get-posts`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token.value}` },
            params: {
                'Filter': sortBy.value,
                'Ascending': !sortDesc.value
            }
        });
    } catch (error) {
        console.error("Помилка завантаження збережених творів:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleUnsavePost = async (postId: number) => {
    try {
        const baseUrl = config.public.apiBase || 'https://localhost:7014';

        await $fetch(`${baseUrl}/api/Savings/${postId}/unsave-post`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token.value}` }
        });

        savedPosts.value = savedPosts.value.filter(p => p.postId !== postId);
    } catch (error) {
        console.error("Помилка при видаленні зі збережених:", error);
    }
};

watch([sortBy, sortDesc], () => {
    fetchSavedPosts();
});

onMounted(() => {
    fetchSavedPosts();
});
</script>

<template>
    <div class="container mx-auto px-4 py-8 font-sans w-full max-w-7xl">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h1 class="text-4xl font-black text-main m-0 flex items-center">
                <Icon name="mdi:bookmark-multiple" class="w-10 h-10 mr-3 text-plum" />
                Збережене
            </h1>

            <div class="relative">
                <button
                    class="bg-plum-light border-2 border-plum-dark rounded-lg px-4 py-2 font-bold text-plum-dark cursor-pointer flex items-center hover:bg-plum hover:text-cream transition-colors relative z-10"
                    @click="isSortMenuOpen = true">
                    <Icon name="mdi:sort" class="w-5 h-5 mr-2" />
                    Сортувати
                </button>

                <transition enter-active-class="transition-opacity duration-300"
                    leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
                    <div v-if="isSortMenuOpen" class="fixed inset-0 w-screen h-screen bg-black/40 z-[40] cursor-pointer"
                        @click="isSortMenuOpen = false"></div>
                </transition>

                <transition enter-active-class="transition-all duration-300 ease-out"
                    leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 -translate-y-2.5 scale-95"
                    leave-to-class="opacity-0 -translate-y-2.5 scale-95">
                    <div v-if="isSortMenuOpen"
                        class="absolute right-0 mt-3 bg-cream-dark border-4 border-plum-dark rounded-xl p-5 min-w-[240px] text-cream z-50 shadow-xl">
                        <h4 class="m-0 mb-4 font-medium text-lg text-muted border-b border-plum-dark pb-2">
                            Сортувати за:
                        </h4>

                        <ul class="list-none p-0 m-0 flex flex-col gap-3">
                            <li class="flex items-center gap-3 cursor-pointer text-muted font-medium hover:text-plum-light transition-colors"
                                @click="sortBy = 'Title'; isSortMenuOpen = false">
                                <div :class="['w-4 h-4 border-2 border-cream rounded-full', sortBy === 'Title' ? 'bg-plum-light' : 'bg-transparent']"></div>
                                Назвою
                            </li>
                            <li class="flex items-center gap-3 cursor-pointer text-muted font-medium hover:text-plum-light transition-colors"
                                @click="sortBy = 'Description'; isSortMenuOpen = false">
                                <div :class="['w-4 h-4 border-2 border-cream rounded-full', sortBy === 'Description' ? 'bg-plum-light' : 'bg-transparent']"></div>
                                Описом
                            </li>
                            <li class="flex items-center gap-3 cursor-pointer text-muted font-medium hover:text-plum-light transition-colors"
                                @click="sortBy = 'CreatedAt'; isSortMenuOpen = false">
                                <div :class="['w-4 h-4 border-2 border-cream rounded-full', sortBy === 'CreatedAt' ? 'bg-plum-light' : 'bg-transparent']"></div>
                                Датою
                            </li>
                        </ul>

                        <div class="mt-5 pt-3 border-t border-plum-dark flex justify-between items-center">
                            <span class="text-sm text-muted">Напрямок:</span>
                            <button class="bg-transparent border-none text-muted hover:text-plum-light cursor-pointer"
                                @click="sortDesc = !sortDesc">
                                <Icon v-if="!sortDesc" name="mdi:sort-ascending" class="w-7 h-7" />
                                <Icon v-else name="mdi:sort-descending" class="w-7 h-7" />
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <div v-if="isLoading && savedPosts.length === 0" class="flex justify-center py-20 text-muted font-bold text-xl items-center">
            <Icon name="mdi:loading" class="w-8 h-8 animate-spin mr-3 text-plum" />
            Завантаження...
        </div>

        <div v-else-if="!isLoading && savedPosts.length === 0"
            class="flex flex-col items-center justify-center py-20 bg-cream-light rounded-3xl border-2 border-dashed border-muted text-center px-4">
            <Icon name="mdi:bookmark-off-outline" class="w-20 h-20 text-muted mb-4" />
            <h3 class="text-2xl font-bold text-main mb-2">Немає збережених творів</h3>
            <p class="text-muted text-lg">Додайте щось до збереженого, щоб читати пізніше.</p>
        </div>

        <transition-group v-else tag="div"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative w-full"
            :class="{ 'opacity-50 pointer-events-none transition-opacity duration-300': isLoading }"
            enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-500 ease-in absolute"
            move-class="transition-all duration-500 ease-in-out" 
            enter-from-class="opacity-0 translate-y-5 scale-95"
            leave-to-class="opacity-0 translate-y-5 scale-95">
            <SavedPostCard v-for="post in savedPosts" :key="post.postId" :post="post" @unsave="handleUnsavePost" />
        </transition-group>

    </div>
</template>