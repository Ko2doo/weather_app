const SUPPORTED_LANG = new Set(["ru", "en", "uz"]);
const DEFAULT_LANG = "en";

export async function onREquestGet({ request, env }) {
  const requestURL = new URL(request.url);
  const city = requestURL.searchParams.get("city");
  const days = requestURL.searchParams.get("days");
  const requestedLang = requestURL.searchParams.get("lang");

  const lang = SUPPORTED_LANG.has(requestedLang) ? requestedLang : DEFAULT_LANG;

  if (!city) {
    return new Response(
      JSON.stringify({ message: "Параметр city обязателен" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

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
