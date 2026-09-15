import { ref, computed } from "vue";
import { API_IPLOOKUP } from "@/lib/constants";
import { sanitizeCityName } from "@/lib/sanitizeCityName";

export function useGeoIp(cityRef) {
  const detectedCity = ref(null);
  const isModalVisible = ref(false);
  const geoError = ref(null);

  // Get city name from ip
  async function detectLocationByIP() {
    try {
      const response = await fetch(API_IPLOOKUP);

      if (!response.ok) {
        throw new Error("Сервис определения города недоступен");
      }

      const result = await response.json();
      const cityName = result.city ? sanitizeCityName(result.city) : null;

      if (!cityName) {
        throw new Error("Не удалось определить город по IP");
      }

      geoError.value = null;
      detectedCity.value = cityName;
      isModalVisible.value = true;
    } catch (err) {
      console.error("Ошибка определения местоположения:", err.message);

      geoError.value = {
        message: "Не удалось определить город по IP.",
      };

      detectedCity.value = null;
    }
  }

  const modalMsg = computed(() => `Вы находитесь в ${detectedCity.value}?`);

  function confirmDetectedCity() {
    if (detectedCity.value) cityRef.value = detectedCity.value;
    isModalVisible.value = false;
  }

  function declineDetectedCity() {
    isModalVisible.value = false;
  }

  return {
    isModalVisible,
    modalMsg,
    geoError,
    detectLocationByIP,
    confirmDetectedCity,
    declineDetectedCity,
  };
}
