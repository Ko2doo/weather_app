<script setup>
import Button from "./Button.vue";
import locationIcon from "@icons/gps.svg?raw";

// Emit events
const emit = defineEmits({
  selectCity(payload) {
    return payload;
  },
});

function select() {
  emit("selectCity", "London");
}
</script>

<template>
  <Button @click="select()">
    <span class="icon" v-html="locationIcon"></span>
    <span class="label">Изменить город</span>
  </Button>

  <input type="text" />
  <Button>Сохранить</Button>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
</style>
