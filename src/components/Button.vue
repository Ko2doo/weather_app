<script setup></script>

<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.button {
  width: fit-content;
  height: fit-content;

  display: flex;

  gap: rem(9);

  font-family: "Montserrat", sans-serif;
  font-size: var(--fsize-l);
  font-weight: var(--fweight-semibold);
  text-align: center;

  padding: rem(14);

  border: none;
  border-radius: var(--border-radius-m);
  outline: none;

  position: relative;
  z-index: 2;
  overflow: hidden;

  background: var(--btn-bg-gradient);
  color: var(--primary-color);

  transition: color 0.2s ease-in-out;

  &::before {
    content: "";

    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--btn-bg-gradient-hover);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  @include media-hover(hover) {
    cursor: pointer;

    &:hover::before {
      opacity: 1;
    }
  }

  @include media-hover(none) {
    &:hover::before {
      opacity: 1;
    }
  }
}
</style>
