<script setup>
import { localeDateTransform } from "@/lib/dateHelper";

defineProps({
  code: Number,
  icon: String,
  text: String,
  temp: Number,
  date: Date,
  isActive: Boolean,
});
</script>

<template>
  <button class="day-card" :class="{ active: isActive }">
    <img :src="icon" :alt="text" :data-condition-code="code" />

    <div class="wrapper">
      <span class="day-card__date">
        {{ localeDateTransform(date, "short") }}
      </span>
      <span class="day-card__temp">{{ Math.round(temp) }} °C</span>
    </div>
  </button>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.day-card {
  display: flex;
  flex-direction: column;

  align-items: center;
  text-align: center;

  font-size: var(--fsize-l);
  font-weight: var(--fweight-regular);
  line-height: normal;

  gap: rem(16);
  padding: clamp(rem(11), 4vw, rem(22));

  background-color: var(--addition-color);
  color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius-m);

  transition:
    0.2s ease-in-out background,
    color;

  &.active {
    background-color: var(--primary-color);
    color: var(--addition-color);
  }

  @include media-hover(hover) {
    cursor: pointer;

    &:hover:not(.active) {
      background-color: var(--day-card-hover);
    }
  }

  @include media-hover(none) {
    &:hover:not(.active) {
      background-color: var(--day-card-hover);
    }
  }

  &__date {
    font-weight: var(--fweight-bold);
  }

  .wrapper {
    display: flex;
    flex-direction: column;

    text-align: center;

    gap: rem(14);
    margin-top: auto;
  }
}
</style>
