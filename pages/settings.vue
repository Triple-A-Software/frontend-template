<template>
    <div class="grid grid-cols-6">
        <div class="max-xl:col-span-6 p-2 border-r border-gray-200 dark:border-gray-800">
            <UVerticalNavigation :links="allowedRoutes" />
        </div>
        <div class="xl:col-span-5 col-span-6 overflow-auto p-2">
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
        label: t("navigation.label.settings.general"),
        icon: "i-tabler-adjustments",
        to: "/settings",
        exact: true,
    },
]);

const allowedRoutes = useFilteredRoutes(routes);
</script>
