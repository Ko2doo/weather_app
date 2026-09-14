const WIKI_LANG_FALLBACK = "ru";

export async function getCityPhoto(cityName, lang = WIKI_LANG_FALLBACK) {
  if (!cityName) return null;

  try {
    const direct = await fetchSummaryThumbnail(cityName, lang);
    if (direct) return direct;

    const foundTitle = await searchTitle(cityName, lang);
    if (!foundTitle) return null;

    return await fetchSummaryThumbnail(foundTitle, lang);
  } catch (err) {
    console.error("Не удалось получить фото города из Wikipedia:", err);
    return null;
  }
}

async function fetchSummaryThumbnail(title, lang) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(url);

  if (!response.ok) return null;

  const data = await response.json();
  return data.originalimage?.source ?? data.thumbnail?.source ?? null;
}

async function searchTitle(query, lang) {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  return data.query?.search?.[0]?.title ?? null;
}
