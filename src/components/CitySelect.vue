<script setup>
import { onMounted, ref } from "vue";

import Button from "./Button.vue";
import Input from "./Input.vue";

import locationIcon from "@icons/gps.svg?raw";

onMounted(() => {
  console.log("City select mounted");
  emit("selectCity", city.value);
});

// Emit events
const emit = defineEmits({
  selectCity(payload) {
    return payload;
  },
});

// reactive state
let city = ref("Алмалык");
let isEdited = ref(false);

function select() {
  isEdited.value = false;
  emit("selectCity", city.value);
}

function edit() {
  isEdited.value = true;
}
</script>

<template>
  <div class="city-select">
    <template v-if="isEdited">
      <Input
        v-model="city"
        v-focus
        placeholder="Введите город"
        @keyup.enter="select()"
      />
      <Button @click="select()">Сохранить</Button>
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

  gap: rem(12);
}

.select-button {
  width: 100%;

  justify-content: center;
}
</style>
