<script setup>
import locationIcon from "@icons/gps.svg?raw";

defineProps({
  datetime: String,
  currentDay: String,
  currentDate: String,
  location: String,
  weatherIcon: String,
  currentTemp: String,
  currentText: String,
});
</script>

<template>
  <section class="current-weather-info">
    <time :datetime="datetime" class="current-day">
      <h1 class="current-dayname">{{ currentDay }}</h1>
      <p class="current-date">{{ currentDate }}</p>
      <p class="current-location">
        <span class="icon" v-html="locationIcon"></span>
        {{ location }}
      </p>
    </time>

    <div class="current-weather">
      <img :src="weatherIcon" :alt="currentText" class="weather-icon" />
      <span class="current-temp">{{ currentTemp }}</span>
      <span class="current-text">{{ currentText }}</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;

.current-weather-info {
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

  padding: rem(32) rem(48);
  margin: 0 var(--space-size-l);

  min-height: rem(333);

  overflow: hidden;

  background-image: url("@assets/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  color: var(--primary-color);

  border-radius: var(--border-radius-xl);

  @media (min-width: rem(1200)) {
    width: rem(490);
    min-height: rem(666);

    margin: 0;
  }
}

.current-day {
  display: flex;
  flex-direction: column;

  gap: rem(16);
}

.current-date {
  font-size: var(--fsize-heading);
  font-weight: var(--fweight-bold);
  line-height: normal;

  display: block;
}

.current-dayname {
  font-size: var(--fsize-subtitle);
  font-weight: var(--fweight-medium);
  line-height: normal;

  display: block;
}

.current-location {
  font-size: var(--fsize-l);
  font-weight: var(--fweight-semibold);
  line-height: normal;

  display: block;

  .icon {
    width: 27px;
    height: 27px;

    margin-right: rem(8);

    object-fit: cover;
  }
}

.current-weather {
  display: flex;
  flex-direction: column;

  gap: rem(8);
}

.weather-icon {
  width: 95px;
  height: 95px;

  object-fit: cover;
}

.current-temp {
  font-size: rem(50);
  font-weight: var(--fweight-bold);
  line-height: normal;

  display: block;
}

.current-text {
  font-size: rem(30);
  font-weight: var(--fweight-bold);
  line-height: normal;

  display: block;
}
</style>
