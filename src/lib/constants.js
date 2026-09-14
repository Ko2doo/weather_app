export const API_FORECAST = "/api/forecast";
export const API_IPLOOKUP = "/api/ip-lookup";
export const CITY_STORAGE_KEY = "userCity";

export const cityProvide = Symbol("city");
// Errors control
export const errorMap = new Map([[1006, "Указанный город не найден"]]);
