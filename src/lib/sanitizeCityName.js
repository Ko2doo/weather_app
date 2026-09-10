export function sanitizeCityName(rawCity) {
  // "Tashkent (Shayxontohur tumani)" -> "Tashkent"
  return rawCity
    .replace(/\s*\(.*?\)\s*/g, " ")
    .split(/\s*,\s*/)[0]
    .split(/\s+-\s+/)[0]
    .replace(/\s+/g, " ")
    .trim();
}
