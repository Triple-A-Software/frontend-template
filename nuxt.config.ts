// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@nuxt/ui", "@nuxtjs/i18n", "@pinia/nuxt", "@vueuse/nuxt", "@unocss/nuxt"],
    ssr: false,
    devServer: {
        port: 3100,
    },
    i18n: {
        locales: ["en", "de"],
        defaultLocale: "en",
        vueI18n: "./i18n.config.ts",
        strategy: "no_prefix",
        detectBrowserLanguage: false, // this is false, because otherwise it overwrites the user selected language by detecting the browser language (TODO: fix this and reenable)
    },
});
