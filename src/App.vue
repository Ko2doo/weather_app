<script setup>
const id = "skyblue";

const message = "Hello world!";
</script>

<template>
  <header>header</header>

  <main :data-main-id="id">
    <h1>{{ message.toUpperCase() }}</h1>
  </main>

  <footer>{{ 10 + 20 }}</footer>
</template>

<style scoped></style>
