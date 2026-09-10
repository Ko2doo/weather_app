<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";

import Button from "./Button.vue";
import Input from "./Input.vue";

import locationIcon from "@icons/gps.svg?raw";
import { cityProvide } from "@/lib/constants.js";

// Context
const city = inject(cityProvide); // by default
const inputValue = ref(city.value);

// reactive state
let isEdited = ref(false);

function select() {
  isEdited.value = false;
  city.value = inputValue.value; // save city
}

function cancel() {
  isEdited.value = false;
}

function edit() {
  isEdited.value = true;
}

// Event handler with Escape
const handleKeyUp = (event) => {
  if (event.key === "Escape") cancel();
};

// Add listener
onMounted(() => {
  document.addEventListener("keyup", handleKeyUp);
});

// Remove listener
onUnmounted(() => {
  document.removeEventListener("keyup", handleKeyUp);
});
</script>

<template>
  <div class="city-select">
    <template v-if="isEdited">
      <Input
        v-model="inputValue"
        v-focus
        placeholder="Введите город"
        @keyup.enter="select()"
      />
      <Button @click="select()">Сохранить</Button>
      <Button @click="cancel()">Отмена</Button>
    </template>

    <Button v-else class="select-button" @click="edit()">
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

  align-items: baseline;

  gap: rem(12);
}

.select-button {
  width: 100%;

  justify-content: center;
}
</style>
