<template>
    <Title>{{ $t("page.profileSettings.preferences.title") }}</Title>
    <div class="max-w-max space-y-3">
        <p class="dark:text-orange-400 text-orange-500">
            {{ $t("common.savesAutomatically") }}
        </p>
        <UFormGroup :label="$t('input.label.theme')" name="theme">
            <USelect
                v-model="state.theme"
                :options="[
                    {
                        name: $t('common.theme.light'),
                        value: 'light',
                    },
                    {
                        name: $t('common.theme.dark'),
                        value: 'dark',
                    },
                ]"
                option-attribute="name"
                @change="CurrentUserStore.updateTheme(state.theme)"
                :icon="themeIcon"
            />
        </UFormGroup>
        <UFormGroup :label="$t('input.label.language')" name="language">
            <USelect
                v-model="state.language"
                :options="[
                    {
                        name: 'English',
                        value: 'en',
                    },
                    {
                        name: 'Deutsch',
                        value: 'de',
                    },
                ]"
                option-attribute="name"
                @change="CurrentUserStore.updateLanguage(state.language)"
                icon="i-tabler-language"
            />
        </UFormGroup>
    </div>
</template>
<script setup lang="ts">
import useCurrentUserStore from "~/stores/currentUserStore";

definePageMeta({
    minRequiredRole: Role.Author,
});

const CurrentUserStore = useCurrentUserStore();

const state = ref({
    theme: "light" as "light" | "dark",
    language: "en" as "en" | "de",
});
const saved = computed(() => ({
    theme: CurrentUserStore.me?.theme ?? "light",
    language: CurrentUserStore.me?.language ?? "en",
}));
syncRefs(saved, state);

const themeIcon = computed(() => (state.value.theme === "dark" ? "i-tabler-moon" : "i-tabler-sun"));
</script>
