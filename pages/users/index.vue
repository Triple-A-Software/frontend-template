<template>
    <Title>{{ $t("page.users.title") }}</Title>
    <div>
        <UCard
            :ui="{
                base: '',
                header: { padding: 'px-4 py-5' },
                body: { padding: '', base: 'divide-y divide-gray-100 dark:divide-gray-800' },
                footer: { padding: 'p-4' },
            }"
        >
            <template #header>
                <div class="flex justify-between">
                    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                        {{ $t("page.users.title") }}
                    </h2>
                    <UButton
                        icon="i-tabler-plus"
                        @click="
                            userSlideoverOpen = true;
                            editingId = undefined;
                        "
                    >
                        {{ $t("action.new") }}
                    </UButton>
                </div>
            </template>

            <div
                class="flex flex-row gap-2 max-md:flex-col justify-between items-center w-full px-4 py-3"
            >
                <div class="flex flex-row max-sm:flex-col items-center gap-2">
                    <div class="flex flex-row items-center gap-2">
                        <span class="text-sm leading-5">{{ $t("input.label.rowsPerPage") }}:</span>
                        <USelect
                            v-model="pageCount"
                            :options="[3, 5, 10, 20, 30, 40]"
                            class="w-20"
                        />
                    </div>
                    <div class="flex flex-row items-center gap-2">
                        <UButtonGroup>
                            <USelectMenu
                                v-model="selectedColumns"
                                :options="columns"
                                multiple
                                by="key"
                                class="w-36"
                            >
                                <template #label>
                                    <div class="i-tabler-columns"></div>
                                    {{ $t("input.label.columns") }}
                                </template>
                            </USelectMenu>
                            <UButton
                                icon="i-tabler-filter-off"
                                color="gray"
                                square
                                :disabled="selectedColumns.length === columns.length"
                                @click="selectedColumns = columns"
                            />
                        </UButtonGroup>
                        <UButton
                            color="gray"
                            square
                            :icon="cardView ? 'i-tabler-layout-rows' : 'i-tabler-layout-grid'"
                            @click="toggleCardView()"
                        />
                    </div>
                </div>

                <div class="flex gap-1.5 items-center">
                    <USelectMenu
                        v-model="selectedRoles"
                        :options="roles"
                        multiple
                        :placeholder="$t('input.label.role')"
                        class="w-40"
                        :ui="{ container: 'z-30' }"
                    />
                    <UButton
                        icon="i-tabler-filter-off"
                        color="gray"
                        size="xs"
                        :disabled="selectedRoles.length === 0"
                        @click="resetFilters"
                    >
                        {{ $t("action.reset") }}
                    </UButton>
                </div>
            </div>

            <UTable
                v-if="!cardView"
                :rows="users ?? []"
                :columns="columnsTable"
                :loading="pending"
                class="w-full"
                :empty-state="{ icon: 'i-tabler-database', label: $t('info.noData') }"
                :ui="{ td: { base: 'w-max' } }"
                v-model:sort="sorting"
            >
                <template #onlineStatus-data="{ row }">
                    <UserStatusBadge :key="row.id" v-if="!pending" :userId="row.id" />
                </template>

                <template #email-data="{ row }">
                    <UTooltip :text="$t('tooltip.copyEmail') + `: ${row.email}`">
                        <UButton
                            icon="i-tabler-clipboard-copy"
                            variant="link"
                            color="gray"
                            @click="copyEmailToClipboard(row.email)"
                        >
                            {{ row.email }}
                        </UButton>
                    </UTooltip>
                </template>

                <template #role-data="{ row }">
                    <RoleBadge :role="row.role" />
                </template>

                <template #actions-data="{ row }">
                    <UButton
                        variant="ghost"
                        color="gray"
                        icon="i-tabler-pencil"
                        @click="
                            userSlideoverOpen = true;
                            editingId = row.id;
                        "
                    />
                    <UButton
                        variant="ghost"
                        color="gray"
                        icon="i-tabler-trash"
                        @click="openDeleteModal(row.id)"
                    />
                    <UButton
                        variant="ghost"
                        color="gray"
                        icon="i-tabler-eye"
                        :to="`/users/${row.id}`"
                    />
                </template>
            </UTable>
            <div
                v-else
                class="grid grid-cols-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 p-2 gap-2"
            >
                <UCard
                    v-for="user in users"
                    :ui="{
                        body: { base: 'flex flex-col gap-1' },
                        footer: { base: 'flex flex-row justify-end gap-1' },
                    }"
                >
                    <div class="relative w-full">
                        <img
                            v-if="user.avatar"
                            :alt="`${user.firstName} ${user.lastName}`"
                            :src="user.avatar"
                            class="object-cover h-24 w-full rounded-lg"
                        />
                        <div
                            v-else
                            class="rounded-lg w-full h-24 flex flex-row items-center justify-center text-3xl border-gray-200 dark:border-gray-800 border border-solid"
                        >
                            <span>{{ user.firstName?.[0] }}</span>
                            <span>{{ user.lastName?.[0] }}</span>
                        </div>
                    </div>
                    <div v-if="user.firstName && columnsTable.find((c) => c.key === 'firstName')">
                        <h1 class="text-lg font-bold">{{ user.firstName }} {{ user.lastName }}</h1>
                        <div
                            class="flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400"
                        >
                            <div class="i-tabler-mail"></div>
                            <p>{{ user.email }}</p>
                        </div>
                    </div>
                    <h1 class="text-lg font-bold" v-else>
                        {{ user.email }}
                    </h1>
                    <div v-if="columnsTable.find((c) => c.key === 'role')">
                        <RoleBadge v-if="user.role" :role="user.role" />
                    </div>
                    <div
                        v-if="user.location && columnsTable.find((c) => c.key === 'location')"
                        class="flex flex-row gap-1 items-center text-gray-500 dark:text-gray-400"
                    >
                        <div class="i-tabler-map-pin"></div>
                        <p>{{ user.location }}</p>
                    </div>
                    <div
                        v-if="user.description && columnsTable.find((c) => c.key === 'description')"
                        class="flex flex-row gap-1 items-center text-gray-500 dark:text-gray-400"
                    >
                        <p>{{ user.description }}</p>
                    </div>
                    <div
                        v-if="user.createdAt && columnsTable.find((c) => c.key === 'createdAt')"
                        class="flex flex-row gap-1 items-center text-sm text-gray-500 dark:text-gray-400"
                    >
                        <div class="i-tabler-clock"></div>
                        <p>
                            {{ $t("page.userProfile.joinedOn", [user.createdAt]) }}
                        </p>
                    </div>
                    <!-- TODO: fix height of footer here to always be the same -->
                    <template #footer>
                        <UButton
                            variant="ghost"
                            color="gray"
                            icon="i-tabler-pencil"
                            @click="
                                userSlideoverOpen = true;
                                editingId = user.id;
                            "
                        />
                        <UButton
                            variant="ghost"
                            color="gray"
                            icon="i-tabler-trash"
                            @click="openDeleteModal(user.id)"
                        />
                        <UButton
                            variant="ghost"
                            color="gray"
                            icon="i-tabler-eye"
                            :to="`/users/${user.id}`"
                        />
                    </template>
                </UCard>
            </div>

            <template #footer>
                <div class="flex flex-wrap flex-col sm:flex-row gap-2 justify-between items-center">
                    <div>
                        <span class="text-sm leading-5">
                            {{
                                $t("common.showing_to_of_results", [
                                    pageTotal === 0 ? 0 : pageFrom,
                                    pageTo,
                                    pageTotal,
                                ])
                            }}
                        </span>
                    </div>

                    <UPagination v-model="page" :page-count="pageCount" :total="pageTotal ?? 0" />
                </div>
            </template>
        </UCard>
        <SlideoverUser
            v-model:open="userSlideoverOpen"
            v-model:userId="editingId"
            @save="refresh"
        />
        <ModalDelete
            v-model:open="deleteModalOpen"
            :name="$t('recordName.user')"
            :id="idToDelete"
            @confirm="deleteUser"
        />
    </div>
</template>
<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import type { UnwrapRef } from "vue";
import useCurrentUserStore from "~/stores/currentUserStore";

definePageMeta({
    minRequiredRole: Role.Author,
});

const { t } = useI18n();
const userService = useUserService();
const CurrentUserStore = useCurrentUserStore();
const toast = useToast();
const appConfig = useAppConfig();
const clipboard = useClipboard();

const columns = computed(() => [
    {
        key: "id" as const,
        label: "#",
        sortable: true,
    },
    {
        key: "email" as const,
        label: t("columns.user.email"),
        sortable: true,
    },
    {
        key: "firstName" as const,
        label: t("columns.user.firstName"),
        sortable: true,
    },
    {
        key: "lastName" as const,
        label: t("columns.user.lastName"),
        sortable: true,
    },
    {
        key: "title" as const,
        label: t("columns.user.title"),
        sortable: true,
    },
    {
        key: "location" as const,
        label: t("columns.user.location"),
        sortable: true,
    },
    {
        key: "language" as const,
        label: t("columns.user.language"),
        sortable: true,
    },
    {
        key: "description" as const,
        label: t("columns.user.description"),
        sortable: true,
    },
    {
        key: "createdAt" as const,
        label: t("columns.common.createdAt"),
        sortable: true,
    },
    {
        key: "onlineStatus" as const,
        label: t("columns.user.onlineStatus"),
        sortable: true,
    },
    {
        key: "role" as const,
        label: t("columns.user.role"),
        sortable: true,
    },
    {
        key: "actions" as const,
        label: t("columns.common.actions"),
        sortable: false,
    },
]);
const roles = computed(() =>
    appConfig.roles.map((r) => ({ key: r.key, label: r.translateLabel ? t(r.label) : r.label })),
);
const selectedColumns = ref(
    columns.value.filter((c) => appConfig.user.defaultColumns.includes(c.key)),
);
const columnsTable = computed(() =>
    columns.value.filter((column) => selectedColumns.value.find((col) => col.key === column.key)),
);
const sorting = ref<{ column: UserColumn; direction: "asc" | "desc" }>({
    column: "email",
    direction: "asc",
});
const cardView = ref(false);
useLocalStorage("user.cardView", cardView);
const toggleCardView = useToggle(cardView);
const sortingField = computed(() => sorting.value.column);
const sortingDirection = computed(() => sorting.value.direction);
const selectedRoles = ref<UnwrapRef<typeof roles>>([]);

// Pagination
const page = ref(1);
const pageCount = ref(10);
const pageTotal = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() => Math.min(page.value * pageCount.value + 1, pageTotal.value ?? 0));

const {
    data: users,
    pending,
    refresh: refreshUsers,
} = await useLazyAsyncData(
    "users:list",
    async () => {
        const result = await userService.getAll(
            selectedRoles.value.map((r) => r.key),
            {
                page: page.value,
                limit: pageCount.value,
            },
            {
                sortBy: sorting.value.column,
                sortDirection: sorting.value.direction,
            },
        );
        pageTotal.value = result?._metadata.totalCount ?? 0;
        return (
            result?.users.map((u) => ({
                ...u,
                role: roleFromString(u.role),
            })) ?? []
        );
    },
    {
        watch: [page, pageCount, selectedRoles, sorting, sortingField, sortingDirection],
    },
);

function resetFilters() {
    selectedRoles.value = [];
}

function refresh() {
    refreshUsers();
}

const userSlideoverOpen = useRouteQuery("editing", undefined, {
    transform: (value) => value === "true",
});
const editingId = useRouteQuery<string | undefined>("id", undefined);
const deleteModalOpen = ref(false);
const idToDelete = ref<string | null>(null);
function openDeleteModal(id: string) {
    if (id === CurrentUserStore.me?.id) {
        toast.add(createErrorNotification(t("statusMessage.error.deleteSelf")));
    } else {
        idToDelete.value = id;
        deleteModalOpen.value = true;
    }
}

async function deleteUser(id: string) {
    await userService.deleteOne(id);
    refresh();
}

function copyEmailToClipboard(email: string) {
    clipboard.copy(email);
    toast.add(createSuccessNotification(t("statusMessage.success.copyEmail"), email));
}
</script>
