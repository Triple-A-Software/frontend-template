<template>
    <div class="grid grid-cols-8 grid-rows-[48px_1fr] h-screen bg-white dark:bg-gray-900">
        <TheTopBar @open-navigation="navOpen = !navOpen" />
        <div class="p-2 border-r border-gray-200 dark:border-gray-800 max-xl:hidden flex flex-col">
            <UVerticalNavigation :links="allowedRoutes" />
            <div class="flex-1"></div>
            <UVerticalNavigation :links="allowedSettingsRoutes" @click="navOpen = false" />
        </div>
        <USlideover v-model="navOpen" side="left">
            <div class="p-4 flex flex-col gap-4">
                <div class="flex flex-row justify-end">
                    <UButton icon="i-tabler-x" color="gray" @click="navOpen = false" />
                </div>
                <UVerticalNavigation :links="allowedRoutes" @click="navOpen = false" />
            </div>
        </USlideover>
        <div class="xl:col-span-7 col-span-8 overflow-auto p-2">
            <UContainer
                :ui="{
                    padding: 'px-0',
                }"
            >
                <slot />
            </UContainer>
        </div>
    </div>
</template>
<script setup lang="ts">
const { t } = useI18n();

const navOpen = ref(false);

const routes = computed(() => [
    {
        label: t("navigation.label.dashboard"),
        icon: "i-tabler-home",
        to: "/",
        exact: true,
    },
    {
        label: t("navigation.label.users"),
        icon: "i-tabler-users",
        to: "/users",
        exact: true,
    },
]);

const settingsRoutes = computed(() => [
    {
        label: t("navigation.label.settings.title"),
        icon: "i-tabler-settings",
        to: "/settings",
        exact: false,
    },
]);

const allowedSettingsRoutes = useFilteredRoutes(settingsRoutes);
const allowedRoutes = useFilteredRoutes(routes);
</script>
