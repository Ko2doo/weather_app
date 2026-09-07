export function localeDateTransform(el, options = {}, locale = "ru-RU") {
  if (!el) return "";

  const dateObj = el instanceof Date ? el : new Date(el);

  if (isNaN(dateObj.getTime())) return "";

  const finalOptions =
    typeof options === "string" ? { weekday: options } : options;
  return dateObj.toLocaleDateString(locale, finalOptions);
}
