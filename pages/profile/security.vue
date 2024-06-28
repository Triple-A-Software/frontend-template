<template>
    <Title>{{ $t("page.profileSettings.security.title") }}</Title>
    <div class="space-y-2">
        <UCard :ui="{ body: { base: 'space-y-2' } }">
            <h2 class="text-lg font-bold">
                {{ $t("page.profileSettings.security.createAccessToken") }}
            </h2>
            <UForm class="space-y-2" @submit="createToken" :state="createTokenState">
                <InputString
                    :label="$t('input.label.tokenName')"
                    v-model="createTokenState.name"
                    name="tokenName"
                />
                <UButton :disabled="createTokenState.name.trim().length === 0" type="submit">
                    {{ $t("action.create.token") }}
                </UButton>
            </UForm>
            <p v-if="createdToken">{{ $t("info.tokenCreated", [createdToken.created.name]) }}</p>
            <UButtonGroup v-if="createdToken">
                <span
                    class="flex items-center ring-1 ring-inset ring-gray-300 dark:ring-gray-700 rounded-l-md px-2.5 select-none"
                >
                    {{ createdToken.created.token.replace(/./g, "*") }}
                </span>
                <UButton icon="i-tabler-copy" color="gray" @click="copyCreated" />
            </UButtonGroup>
        </UCard>
        <UCard>
            <h2 class="text-lg font-bold">
                {{ $t("page.profileSettings.security.accessTokens") }}
            </h2>
            <UTable
                :rows="tokens"
                :columns="tokenColumns"
                :loading="tokensPending"
                class="w-full"
                :ui="{ td: { base: 'max-w-[0] truncate' } }"
                :empty-state="{ label: $t('info.noData'), icon: 'i-tabler-database' }"
            >
                <template #createdAt-data="{ row }">
                    <span>{{ dayjs(row.createdAt).format("LLL") }}</span>
                </template>
                <template #actions-data="{ row }">
                    <UButton
                        variant="ghost"
                        color="gray"
                        icon="i-tabler-trash"
                        @click="openDeleteModal(row.id, 'token')"
                    />
                </template>
            </UTable>
        </UCard>
        <UCard>
            <h2 class="text-lg font-bold">{{ $t("page.profileSettings.security.sessions") }}</h2>
            <UTable
                :rows="sessions"
                :loading="sessionsPending"
                :columns="sessionColumns"
                :empty-state="{ label: $t('info.noData'), icon: 'i-tabler-database' }"
            >
                <template #createdAt-data="{ row }">
                    <span>{{ dayjs(row.createdAt).format("LLL") }}</span>
                </template>
                <template #actions-data="{ row }">
                    <UButton
                        variant="ghost"
                        color="gray"
                        icon="i-tabler-trash"
                        @click="openDeleteModal(row.session.id, 'session')"
                    />
                </template>
            </UTable>
        </UCard>
        <ModalDelete
            v-model:open="deleteModalOpen"
            :name="deleteType === 'token' ? $t('recordName.token') : $t('recordName.session')"
            :id="idToDelete"
            @confirm="confirmDelete"
        />
    </div>
</template>
<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";

definePageMeta({
    minRequiredRole: Role.Author,
});

const tokenService = useTokenService();
const sessionService = useSessionService();
const { t } = useI18n();
const toast = useToast();

const createTokenState = ref({
    name: "",
});

const tokenColumns = computed(() => [
    {
        key: "name" as const,
        label: t("columns.token.name"),
        sortable: true,
    },
    {
        key: "createdAt" as const,
        label: t("columns.common.createdAt"),
        sortable: true,
    },
    {
        key: "actions" as const,
        label: t("columns.common.actions"),
        sortable: false,
    },
]);
const sessionColumns = computed(() => [
    {
        key: "ipAddress" as const,
        label: t("columns.session.ipAddress"),
        sortable: true,
    },
    {
        key: "userAgent" as const,
        label: t("columns.session.userAgent"),
        sortable: true,
    },
    {
        key: "createdAt" as const,
        label: t("columns.common.createdAt"),
        sortable: true,
    },
    {
        key: "actions" as const,
        label: t("columns.common.actions"),
        sortable: false,
    },
]);

const {
    data: tokens,
    isPending: tokensPending,
    refetch: refreshTokens,
} = useQuery({
    queryKey: ["tokens:list"],
    queryFn: async () => {
        const result = await tokenService.getAll();
        return result?.tokens ?? [];
    },
});

const {
    data: sessions,
    isPending: sessionsPending,
    refetch: refreshSessions,
} = useQuery({
    queryKey: ["sessions:list"],
    queryFn: async () => {
        const result = await sessionService.getAll();
        return (
            result?.sessions.map((t) => ({
                ...t,
                ipAddress: t.session.ipAddress,
                userAgent: t.session.userAgent,
            })) ?? []
        );
    },
});

const { mutate: createToken, data: createdToken } = useMutation({
    mutationFn: () => tokenService.createOne(createTokenState.value.name),
    async onSuccess(data) {
        createTokenState.value = {
            name: "",
        };
        toast.add(createSuccessNotification(t("statusMessage.success.createToken")));
        await refreshTokens();
    },
});

function copyCreated() {
    navigator.clipboard.writeText(createdToken.value?.created?.token ?? "");
    toast.add(createSuccessNotification(t("statusMessage.success.copyToken")));
}

const deleteType = ref<"token" | "session">("token");
const deleteModalOpen = ref(false);
const idToDelete = ref<number | null>(null);
function openDeleteModal(id: number, type: "token" | "session") {
    idToDelete.value = id;
    deleteModalOpen.value = true;
    deleteType.value = type;
}
async function confirmDelete() {
    if (!idToDelete.value) {
        deleteModalOpen.value = false;
        return;
    }
    if (deleteType.value === "token") {
        await tokenService.deleteOne(idToDelete.value);
        refreshTokens();
        toast.add(createSuccessNotification(t("statusMessage.success.deleteToken")));
    } else if (deleteType.value === "session") {
        try {
            const result = await sessionService.deleteOne(idToDelete.value);
            refreshSessions();
            toast.add(createSuccessNotification(t("statusMessage.success.deleteSession")));
        } catch (error) {
            toast.add(createErrorNotification(t("statusMessage.error.deleteCurrentSession")));
        }
    }
    deleteModalOpen.value = false;
    idToDelete.value = null;
}
</script>
