<template>
    <div class="col-span-8 h-full border-b border-gray-200 dark:border-gray-800 p-2 flex flex-row gap-2">
        <UButton icon="i-tabler-menu-2" variant="ghost" color="gray" class="xl:hidden" @click="$emit('open-navigation')" />
        <div class="flex-grow"></div>
        <UButton class="text-gray-500 dark:text-gray-400" icon="i-tabler-search" color="gray"
            @click="commandPaletteOpen = true">
            <span class="flex-grow md:pr-20">
                {{ $t("common.search") }}...
            </span>
            <div class="flex items-center gap-0.5">
                <UKbd>{{ metaSymbol }}</UKbd>
                <UKbd>K</UKbd>
            </div>
        </UButton>
        <UModal v-model="commandPaletteOpen">
            <TheCommandPalette class="max-h-[50vh]" @close="commandPaletteOpen = false" />
        </UModal>
        <div class="flex-grow"></div>
        <UButton :icon="darkModeToggleIcon" color="gray" variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
        <UDropdown :items="[
            [
                {
                    label: CurrentUserStore.me?.email ?? '',
                    slot: 'account',
                    disabled: true
                },
            ],
            [
                {
                    label: $t('navigation.label.viewProfile'),
                    icon: 'i-tabler-user-circle',
                    to: `/users/${CurrentUserStore.me?.id ?? ''}`
                },
                {
                    label: $t('navigation.label.profileSettings'),
                    icon: 'i-tabler-user-cog',
                    to: '/profile'
                },
                {
                    label: $t('action.setStatus'),
                    slot: 'set-status',
                    click: () => {
                        statusModalOpen = true;
                    }
                },
            ],
            [
                {
                    label: $t('navigation.label.logout'),
                    icon: 'i-tabler-logout',
                    to: '/logout'
                },
            ]
        ]" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-end' }">
            <UAvatar :src="CurrentUserStore.me?.avatar ?? ''" :alt="avatarFallback ?? ''"
                :icon="avatarFallback ? '' : 'i-tabler-user'" :chip-color="onlineStatus" chip-text="" />
            <template #account="{ item }">
                <div class="text-left">
                    <p>
                        {{ $t("common.signedInAs") }}
                    </p>
                    <p class="truncate font-medium text-gray-900 dark:text-white">
                        {{ item.label }}
                    </p>
                </div>
            </template>
            <template #set-status="{ item }">
                <span class="rounded-full h-3 w-3 m-1" :class="statusClasses" />
                <span class="truncate">
                    {{ item.label }}
                </span>
            </template>
        </UDropdown>
        <UModal v-model="statusModalOpen">
            <UCard>
                <template #header>
                    <div class="flex justify-between">
                        <h2>{{ $t("action.setStatus") }}</h2>
                        <UButton square variant="ghost" color="gray" icon="i-tabler-x" @click="statusModalOpen = false" />
                    </div>
                </template>
                <div class="grid grid-cols-2 grid-rows-2 gap-2">
                    <UButton color="green" :label="$t('common.onlineStatus.online')" @click="updateStatus('online')" />
                    <UButton color="gray" :label="$t('common.onlineStatus.offline')" @click="updateStatus('offline')" />
                    <UButton color="orange" :label="$t('common.onlineStatus.away')" @click="updateStatus('away')" />
                    <UButton color="red" :label="$t('common.onlineStatus.do_not_disturb')"
                        @click="updateStatus('do_not_disturb')" />
                </div>
            </UCard>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import useCurrentUserStore from "~/stores/currentUserStore";

const CurrentUserStore = useCurrentUserStore();
const { metaSymbol } = useShortcuts();

defineShortcuts({
    meta_k: {
        usingInput: true,
        handler() {
            commandPaletteOpen.value = !commandPaletteOpen.value;
        },
    },
});

const commandPaletteOpen = ref(false);

const avatarFallback = computed(() => {
    if (CurrentUserStore.me?.firstName) {
        return `${CurrentUserStore.me.firstName} ${CurrentUserStore.me.lastName ?? ""}`;
    }
    return null;
});

const colorMode = useColorMode();
const isDark = computed({
    get() {
        return colorMode.value === "dark";
    },
    set() {
        CurrentUserStore.updateTheme(colorMode.value === "dark" ? "light" : "dark");
    },
});
const onlineStatus = computed(() => {
    switch (CurrentUserStore.status) {
        case "online":
            return "green";
        case "do_not_disturb":
            return "red";
        case "away":
            return "orange";
        default:
            return "gray";
    }
});
const statusClasses = computed(() => ({
    "bg-green-500": onlineStatus.value === "green",
    "dark:bg-green-400": onlineStatus.value === "green",
    "bg-red-500": onlineStatus.value === "red",
    "dark:bg-red-400": onlineStatus.value === "red",
    "bg-orange-500": onlineStatus.value === "orange",
    "dark:bg-orange-400": onlineStatus.value === "orange",
    "bg-gray-500": onlineStatus.value === "gray",
    "dark:bg-gray-400": onlineStatus.value === "gray",
}));
const darkModeToggleIcon = computed(() => (isDark.value ? "i-tabler-moon-filled" : "i-tabler-sun"));

const statusModalOpen = ref(false);

function updateStatus(status: "online" | "offline" | "away" | "do_not_disturb") {
    CurrentUserStore.updateStatus(status);
    statusModalOpen.value = false;
}
</script>
