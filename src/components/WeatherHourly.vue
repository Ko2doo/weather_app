<script setup>
import { ref } from "vue";
import { localeDateTransform } from "@/lib/dateHelper.js";
import Title from "./Title.vue";

defineProps({
  hourly: {
    type: Array,
    required: true,
  },
});

const scrollContainer = ref(null);

function handleWheel(event) {
  if (event.deltaY === 0) return;

  const container = scrollContainer.value;
  if (!container) return;

  const isScrollingForward = event.deltaY > 0;

  const canScrollRight =
    container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
  const canScrollLeft = container.scrollLeft > 1;

  if (
    (isScrollingForward && canScrollRight) ||
    (!isScrollingForward && canScrollLeft)
  ) {
    event.preventDefault();
    container.scrollLeft += event.deltaY;
  }
}
</script>

<template>
  <Title title="Почасовой прогноз" />

  <section ref="scrollContainer" class="weather-hourly" @wheel="handleWheel">
    <ul class="hour-list">
      <li v-for="hour in hourly" :key="hour.time_epoch" class="hour">
        <div class="condition">
          <span class="current-time">
            <strong>
              {{
                localeDateTransform(hour.time, {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </strong>
          </span>

          <img
            :src="hour.condition.icon"
            :alt="hour.condition.text"
            class="icon"
          />
          <div class="wrapper">
            <span>{{ hour.condition.text }}</span>
            <span>
              Температура: <strong>{{ hour.temp_c }} °C</strong>
            </span>
            <span>
              Ощущаемая температура:
              <strong>{{ hour.feelslike_c }} °C</strong>
            </span>
            <span>
              УФ-индекс: <strong>{{ hour.uv }}</strong>
            </span>
          </div>
        </div>

        <div class="full-condition">
          <span>
            Облачность: <strong>{{ hour.cloud }} %</strong>
          </span>
          <span>
            Влажность: <strong>{{ hour.humidity }}</strong>
          </span>
          <span>
            Атмосферное давление: <strong>{{ hour.pressure_in }}</strong>
          </span>
          <span>
            Скорость ветра: <strong>{{ hour.wind_kph }} км/ч</strong>
          </span>
          <span>
            Направление ветра: <strong>{{ hour.wind_dir }}</strong>
          </span>
          <span>
            Ветро-холодовой индекс:
            <strong>{{ hour.windchill_c }} км/ч</strong>
          </span>
          <span>
            Видимость <strong>{{ hour.vis_km }} км</strong>
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.weather-hourly {
  @include weather-widget-default;

  & {
    flex-wrap: nowrap;

    scroll-behavior: auto;
    scrollbar-width: none;

    overflow-y: scroll;
  }
}

.hour-list {
  display: flex;
  flex-wrap: nowrap;
}

.hour {
  width: calc(#{rem(230)} - #{rem(10)});

  display: flex;
  flex-direction: column;

  padding: rem(20);

  background-color: var(--addition-color);
  border-radius: var(--border-radius-m);

  &:not(:first-child) {
    margin-left: rem(10);
  }

  & > * {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.current-time {
  font-size: var(--fsize-l);
  font-weight: var(--fweight-medium);
  line-height: normal;

  display: block;

  text-align: center;
}

.icon {
  width: 86px;
  height: 86px;

  display: flex;
  flex: 0 0 auto;

  margin: rem(10) auto;

  object-fit: cover;
}

.wrapper {
  display: flex;
  flex-direction: column;

  row-gap: rem(8);
}

.condition {
  padding-bottom: rem(14);
  margin-bottom: rem(14);
  border-bottom: rem(2) solid var(--secondary-color);
}

.full-condition {
  display: flex;
  flex-direction: column;

  gap: rem(8);

  & > * {
    font-size: var(--fsize-s);
    font-weight: var(--fweight-regular);
  }
}
</style>
