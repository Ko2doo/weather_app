const SUPPORTED_LANG = new Set(["ru", "en", "uz"]);
const DEFAULT_LANG = "en";

// eslint-disable-next-line no-useless-escape
const CITY_PATTERN = /^[\p{L}\s\-]{1,60}$/u;

const ALLOWED_ORIGINS = new Set([
  "https://weather-app.galaxyrobotix.workers.dev",
  "http://localhost:5173",
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/forecast") {
      return handleForecast(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleForecast(request, env) {
  const origin =
    request.headers.get("origin") || request.headers.get("referer");
  const isAllowedOrigin = origin
    ? [...ALLOWED_ORIGINS].some((allowed) => origin.startsWith(allowed))
    : false;

  if (!isAllowedOrigin) {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }

  const requestURL = new URL(request.url);
  const city = requestURL.searchParams.get("city");
  const days = requestURL.searchParams.get("days");
  const requestedLang = requestURL.searchParams.get("lang");

  if (!city || !CITY_PATTERN.test(city)) {
    return new Response(
      JSON.stringify({ message: "Некорректный параметр city" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const lang = SUPPORTED_LANG.has(requestedLang) ? requestedLang : DEFAULT_LANG;

  const apiUrl = new URL("https://api.weatherapi.com/v1/forecast.json");
  apiUrl.search = new URLSearchParams({
    q: city,
    lang,
    key: env.WEATHER_API_KEY,
    days,
  });

  const upstreamResponse = await fetch(apiUrl);
  const result = await upstreamResponse.json();

  return new Response(JSON.stringify(result), {
    status: upstreamResponse.status,
    headers: { "content-type": "application/json" },
  });
}
