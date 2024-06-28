import de from "./locales/de.json";
import en from "./locales/en.json";

export default defineI18nConfig(() => ({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,
    messages: {
        en,
        de,
    },
}));
