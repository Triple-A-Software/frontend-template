<template>
    <div class="grid grid-cols-6">
        <div
            class="xl:col-span-1 md:col-span-2 col-span-6 p-2 xl:border-r xl:border-gray-200 xl:dark:border-gray-800"
        >
            <UVerticalNavigation :links="allowedRoutes" />
        </div>
        <div class="md:col-span-4 xl:col-span-5 col-span-6 overflow-auto p-2">
            <NuxtPage />
        </div>
    </div>
</template>
<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
    minRequiredRole: Role.Author,
});

const routes = computed(() => [
    {
        label: t("navigation.label.profile.title"),
        icon: "i-tabler-user-cog",
        to: "/profile",
        exact: true,
    },
    {
        label: t("navigation.label.profile.password"),
        icon: "i-tabler-lock",
        to: "/profile/password",
        exact: true,
    },
    {
        label: t("navigation.label.profile.preferences"),
        icon: "i-tabler-adjustments",
        to: "/profile/preferences",
        exact: true,
    },
    {
        label: t("navigation.label.profile.security"),
        icon: "i-tabler-lock-cog",
        to: "/profile/security",
        exact: true,
    },
]);

const allowedRoutes = useFilteredRoutes(routes);
</script>
