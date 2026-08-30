<script setup>
import Button from "@components/Button.vue";
</script>

<template>
  <main class="container">
    <section class="weather-box">
      <Button>Изменить город</Button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.container {
  width: 100%;
  min-height: 100dvh;

  margin-left: auto;
  margin-right: auto;

  display: flex;
  place-items: center;

  @media (min-width: rem(1200)) {
    max-width: rem(944);
  }
}

.weather-box {
  width: 100%;

  flex-basis: 100%;
  display: flex;
  flex-direction: column;

  padding: rem(55) rem(50);
  margin: 0 rem(20);

  background-color: var(--secondary-color);
  border-radius: var(--border-radius-l);

  @media (min-width: rem(1200)) {
    margin: 0;
  }
}
</style>
