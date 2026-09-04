<script setup>
const props = defineProps({
  error: String,
});
</script>

<template>
  <div v-if="props.error" class="error-message">
    <p>{{ props.error }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;

.error-message {
  min-width: rem(400);
  height: auto;

  display: block;

  padding: rem(14);
  margin-top: rem(-55);
  margin-bottom: rem(50);

  background-color: var(--addition-color);
  border-bottom-left-radius: var(--border-radius-l);
  border-bottom-right-radius: var(--border-radius-l);

  & > * {
    font-size: rem(18);
    font-weight: var(--fweight-regular);
    line-height: normal;

    display: block;

    text-align: center;

    color: var(--primary-color);
  }
}
</style>
