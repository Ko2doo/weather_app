<script setup>
const data = defineModel({
  type: String,
  required: true,
});
</script>

<template>
  <input v-model="data" class="input-element" type="text" />
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;

.input-element {
  width: rem(260);

  font-size: rem(18);
  font-weight: var(--fweight-regular);
  line-height: normal;

  padding: rem(15) rem(18);

  color: var(--primary-color);
  background-color: var(--addition-color);
  border: none;
  border-radius: var(--border-radius-m);

  outline-color: var(--secondary-color);

  &::placeholder {
    color: var(--input-color);
  }
}
</style>
