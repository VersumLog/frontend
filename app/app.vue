<script setup>
import * as signalR from "@microsoft/signalr";

const config = useRuntimeConfig();
const newPost = ref({ title: '', content: '', author: '' });

// get posts
const { data: posts, refresh, pending } = await useFetch(`${config.public.apiBase}/api/Posts`, {
  server: false, //for dev only
  lazy: true     
});

// post post
const publishPost = async () => {
  if (!newPost.value.title || !newPost.value.content) return;

  await $fetch(`${config.public.apiBase}/api/Posts`, {
    method: 'POST',
    body: newPost.value
  });

  newPost.value = { title: '', content: '', author: '' };
  refresh(); // update
};

//signalR test
onMounted(() => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${config.public.apiBase}/notificationHub`) // speaks to backend
    .withAutomaticReconnect()
    .build();

  // update
  connection.on("NewPostPublished", () => {
    console.log("New Post...");
    refresh();
  }); 

  connection.start();
});


</script>

<template>
  <div class="container">
    <h1>Versum — Пиши твори тут</h1>

    <div class="editor">
      <input v-model="newPost.title" placeholder="Назва твору" />
      <input v-model="newPost.author" placeholder="Ваше ім'я" />
      <textarea v-model="newPost.content" placeholder="Напишіть щось неймовірне..."></textarea>
      <button @click="publishPost">Опублікувати</button>
    </div>

    <hr />

    <div v-for="post in posts" :key="post.id" class="post-card">
      <h2>{{ post.title }}</h2>
      <p class="meta">Автор: {{ post.author }} | {{ new Date(post.createdAt).toLocaleDateString() }}</p>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>