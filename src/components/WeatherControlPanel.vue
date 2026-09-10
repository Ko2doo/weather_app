<script setup>
import { computed } from "vue";

import Stat from "@components/Stat.vue";
import DayCard from "@components/DayCard.vue";
import CitySelect from "@components/CitySelect.vue";
import Error from "@components/Error.vue";
import { errorMap } from "@/lib/constants";

const props = defineProps({
  error: Object,
  data: Object,
  activeIndex: {
    type: Number,
    required: false,
    default: null,
  },
  forecastDays: {
    type: Array,
    required: true,
  },
});

// Stats day data
const dataStats = computed(() => {
  if (!props.data?.forecast?.forecastday) return [];

  const rawActiveDay =
    props.data.forecast.forecastday.find(
      (dayItem) => dayItem.date_epoch === props.activeIndex,
    ) || props.data.forecast.forecastday[0];

  if (!rawActiveDay) return [];

  return [
    { label: "Влажность", stat: `${rawActiveDay.day.avghumidity} %` },
    { label: "УФ-индекс", stat: rawActiveDay.day.uv },
    { label: "Ветер", stat: `${rawActiveDay.day.maxwind_kph} км/ч` },
  ];
});

const emit = defineEmits(["select-index", "select-city"]);

const errorDisplay = computed(() => {
  return errorMap.get(props.error?.error?.code);
});
</script>

<template>
  <section class="weather-control-panel">
    <div class="inner-wrapper">
      <Error :error="errorDisplay" class="error-msg" />

      <Stat :stats="dataStats" />

      <div class="wrapper">
        <DayCard
          v-for="day in forecastDays"
          :key="day.id"
          :code="day.weatherCode"
          :icon="day.icon"
          :text="day.text"
          :temp="day.temp"
          :date="day.date"
          :is-active="activeIndex == day.id"
          class="card-width"
          @click="() => emit('select-index', day.id)"
        />
      </div>

      <CitySelect @select-city="(city) => emit('select-city', city)" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.weather-control-panel {
  @include weather-widget-default;

  & {
    flex-direction: column;
    overflow: hidden;
  }
}

.inner-wrapper {
  display: flex;
  flex-direction: column;

  gap: rem(74);

  @media (min-width: rem(1200)) {
    width: rem(450);
  }
}

.error-msg {
  position: absolute;
  top: 0;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;

  justify-content: center;
}

.card-width {
  width: calc(100% / 3);

  @media (min-width: rem(620)) {
    width: calc((100% / 6) - rem(2));

    &:not(:first-child) {
      margin-left: rem(2);
    }
  }

  @media (min-width: rem(620)) {
    width: calc((100% / 4) - rem(2));
  }
}
</style>
