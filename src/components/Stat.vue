<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <article class="stat">
    <ul class="stat-list">
      <li v-for="(item, index) in stats" :key="index" class="stat-list__item">
        <span class="label">{{ item.label }}</span>
        <span class="info">{{ item.stat }}</span>
      </li>
    </ul>
  </article>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;

.stat-list {
  display: list-item;
  list-style-type: none;

  &__item {
    display: flex;

    justify-content: space-between;
    align-items: center;

    font-size: var(--fsize-xl);
    font-weight: var(--fweight-bold);

    .label {
      text-transform: uppercase;
    }

    .info {
      font-weight: var(--fweight-medium);
    }

    &:not(:last-child) {
      margin-block-end: rem(16);
    }
  }
}
</style>
