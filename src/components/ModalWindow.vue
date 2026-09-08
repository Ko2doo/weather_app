<script setup>
import { onUnmounted, watch } from "vue";

const { messages, visible } = defineProps({
  messages: String,
  visible: {
    type: Boolean,
    default: false,
  },
});

const MODAL_OPEN_CLASS = "modal-window-open";

watch(
  () => visible,
  (isVisible) => {
    document.body.classList.toggle(MODAL_OPEN_CLASS, isVisible);
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.classList.remove(MODAL_OPEN_CLASS);
});
</script>

<template>
  <article class="modal-window">
    <h2 class="modal-message">{{ messages }}</h2>
    <slot></slot>
  </article>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.modal-window {
  position: fixed;
  top: rem(8);
  left: 0;
  right: 0;

  z-index: 22;

  width: 44.4444%;

  display: flex;
  flex-direction: column;

  gap: rem(14);
  padding: clamp(rem(26), 4vw, rem(55)) clamp(rem(20), 4vw, rem(50));
  margin: 0 auto;

  overflow: hidden;

  background-color: var(--secondary-color);
  border-radius: var(--border-radius-l);
}

.modal-message {
  font-size: var(--fsize-l);
  font-weight: var(--fweight-medium);
  line-height: normal;

  display: block;

  text-align: center;

  color: var(--primary-color);
}
</style>
