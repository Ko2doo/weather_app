<script setup>
defineProps({
  title: String,
});
</script>

<template>
  <div class="title">
    <p class="title-item">{{ title }}</p>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.title {
  width: 100%;
  text-align: left;

  margin-left: var(--space-size-l);
  margin-right: var(--space-size-l);

  padding-top: var(--space-size-l);

  @media (min-width: rem(1200)) {
    margin-left: 0;
    margin-right: 0;
  }
}

.title-item {
  font-size: var(--fsize-xl);
  font-weight: var(--fweight-medium);
  line-height: normal;

  display: block;

  color: var(--primary-color);
}
</style>
