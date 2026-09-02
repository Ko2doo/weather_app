<script setup>
import { ref } from "vue";

import Button from "./Button.vue";
import locationIcon from "@icons/gps.svg?raw";

// Emit events
const emit = defineEmits({
  selectCity(payload) {
    return payload;
  },
});

// reactive state
let isEdited = ref(false);

function select() {
  isEdited.value = false;
  emit("selectCity", "London");
}

function edit() {
  isEdited.value = true;
}
</script>

<template>
  <div class="city-select">
    <template v-if="isEdited">
      <input class="input-element" placeholder="Введите город" type="text" />
      <Button @click="select()">Сохранить</Button>
    </template>

    <Button v-else @click="edit()">
      <span class="icon" v-html="locationIcon"></span>
      <span class="label">Изменить город</span>
    </Button>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;

.city-select {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  gap: rem(12);
}

.input-element {
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
