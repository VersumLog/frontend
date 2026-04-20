<script setup>
import * as signalR from "@microsoft/signalr";

const config = useRuntimeConfig();
const newPost = ref({ title: '', content: '', author: '' });

const { data: posts, refresh } = await useFetch(`${config.public.apiBase}/api/Posts`, {
  server: false,
  lazy: true     
});

const publishPost = async () => {
  if (!newPost.value.title || !newPost.value.content) return;
  await $fetch(`${config.public.apiBase}/api/Posts`, {
    method: 'POST',
    body: newPost.value
  });
  newPost.value = { title: '', content: '', author: '' };
  refresh();
};

onMounted(() => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${config.public.apiBase}/notificationHub`)
    .withAutomaticReconnect()
    .build();

  connection.on("NewPostPublished", () => {
    refresh();
  }); 

  connection.start();
});
</script>

<template>
  <div class="container">
    <h1>Versum — Пиши твори тут</h1>
    <NuxtLink to="/register" class="auth-link">Перейти до реєстрації</NuxtLink>

    <div class="editor">
      <input v-model="newPost.title" placeholder="Назва твору" />
      <input v-model="newPost.author" placeholder="Ваше ім'я" />
      <textarea v-model="newPost.content" placeholder="Напишіть щось неймовірне..."></textarea>
      <button @click="publishPost">Опублікувати</button>
    </div>

    <hr />

    <div v-for="post in posts" :key="post.id" class="post-card">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>