<template>
    <Title>{{ t("page.userProfile.title") }}: {{ data?.firstName }} {{ data?.lastName }}</Title>
    <div class="grid grid-cols-4 gap-2">
        <div class="xl:col-span-1 col-span-4">
            <UCard
                :ui="{
                    body: { base: 'flex xl:flex-col max-[500px]:flex-col flex-row gap-2' },
                }"
            >
                <div class="relative w-64 xl:w-full rounded">
                    <img
                        v-if="avatar"
                        :alt="`${data?.firstName} ${data?.lastName}`"
                        :src="avatar"
                        class="object-cover h-64 w-64 rounded-lg"
                    />
                    <div
                        v-else
                        class="rounded-full w-64 h-64 flex flex-row items-center justify-center text-5xl border-gray-200 dark:border-gray-800 border border-solid"
                    >
                        <span>{{ data?.firstName?.[0] }}</span>
                        <span>{{ data?.lastName?.[0] }}</span>
                    </div>
                    <div
                        class="absolute text-xs rounded-full p-3 border-white border-4 dark:border-gray-900 border-solid group"
                        :class="{
                            [status.bgColor.value ?? '']: true,
                            'bottom-6 right-6': !avatar,
                            '-bottom-2 left-full -ml-6': avatar,
                        }"
                    ></div>
                </div>
                <div class="flex flex-col gap-1">
                    <div v-if="data?.firstName">
                        <h1 class="text-lg font-bold">
                            {{ data?.firstName }} {{ data?.lastName }}
                        </h1>
                        <div
                            class="flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400"
                        >
                            <div class="i-tabler-mail"></div>
                            <p>{{ data?.email }}</p>
                        </div>
                    </div>
                    <h1 class="text-lg font-bold" v-else>
                        {{ data?.email }}
                    </h1>
                    <div>
                        <RoleBadge v-if="data?.role" :role="data?.role" />
                    </div>
                    <div
                        v-if="data?.location"
                        class="flex flex-row gap-1 items-center text-gray-500 dark:text-gray-400"
                    >
                        <div class="i-tabler-map-pin"></div>
                        <p>{{ data.location }}</p>
                    </div>
                    <div
                        v-if="data?.description"
                        class="flex flex-row gap-1 items-center text-gray-500 dark:text-gray-400"
                    >
                        <p>{{ data.description }}</p>
                    </div>
                    <div
                        v-if="data?.createdAt"
                        class="flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400"
                    >
                        <div class="i-tabler-clock"></div>
                        <p>{{ $t("page.userProfile.joinedOn", [formattedCreatedAt]) }}</p>
                    </div>
                </div>
            </UCard>
        </div>

        <div class="xl:col-span-3 col-span-4 max-md:p-2">
            <h2 class="text-md mb-2 font-bold">{{ $t("page.userProfile.activity") }}</h2>
            <History :items="activityHistory">
                <template #timestamp="{ item }">
                    <UTooltip v-if="item.timestamp" :text="formatActivityTimestamp(item.timestamp)">
                        <span
                            class="whitespace-nowrap text-xs justify-self-end text-gray-400 select-none"
                        >
                            {{ relativeTimestamp(item.timestamp) }}
                        </span>
                    </UTooltip>
                </template>
                <template #label="{ item }">
                    <span>{{ item.label }}</span>
                </template>
                <template #description="{ item }">
                    <span
                        v-for="desc in item.description?.split('\n')"
                        class="text-xs text-gray-500 dark:text-gray-400"
                    >
                        {{ desc }}
                    </span>
                </template>
            </History>
            <UPagination v-model="activityPage" :page-count="20" :total="activityTotalCount" />
        </div>
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";

definePageMeta({
    minRequiredRole: Role.Author,
});

const userService = useUserService();
const activityService = useActivityService();
const route = useRoute();
const { t, locale } = useI18n();
const idParam = computed(() => route.params.id as string);

const { data } = useAsyncData(
    "user",
    async () => {
        const user = await userService.getById(route.params.id as string);
        return {
            ...user,
            role: roleFromString(user?.role),
        };
    },
    {
        watch: [idParam],
    },
);
const formattedCreatedAt = computed(() => {
    console.log(data.value?.createdAt, dayjs(data.value?.createdAt));
    return dayjs(data.value?.createdAt).locale(locale.value).format("LL");
});
const status = useUserStatus(route.params.id as string);
const avatar = computed(() => data.value?.avatar ?? "");

const activityPage = ref(1);
const activity = useAsyncData(
    async () => {
        const data = await activityService.getForUser(route.params.id as string, {
            limit: 20,
            page: activityPage.value,
        });
        return data;
    },
    {
        watch: [activityPage],
    },
);
const activityTotalCount = computed(() => activity.data.value?._metadata.totalCount ?? 0);
const activityHistory = computed(() => {
    return (activity.data.value?.activity ?? []).map((a) => {
        const label = getActivityLabel(a, t);
        const description = getActivityDescription(a, t);
        return {
            label,
            description,
            icon: getActivityIcon(a),
            timestamp: a.actionAt,
        };
    });
});

function formatActivityTimestamp(timestamp: Date | string) {
    return dayjs(timestamp).locale(locale.value).format("LLL");
}
function relativeTimestamp(timestamp: Date | string) {
    return dayjs(timestamp).locale(locale.value).fromNow();
}
</script>
