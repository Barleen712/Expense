import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./en.json";
import spanish from "./es.json";
import italian from "./it.json";

i18n.use(initReactI18next).init({
  initImmediate: false,
  resources: {
    en: {
      translation: english,
    },
    es: {
      translation: spanish,
    },
    it: {
      translation: italian,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
