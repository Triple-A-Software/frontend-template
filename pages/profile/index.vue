<template>
    <Title>{{ $t("page.profileSettings.profile.title") }}</Title>
    <UForm :state="state" @submit="handleSubmit()" class="max-w-max space-y-3">
        <UCard>
            <div class="flex flex-row items-center gap-6">
                <UAvatar size="2xl" :alt="`${me.firstName} ${me.lastName}`" :src="currentAvatar" />
                <div>
                    <span v-if="me.firstName"> {{ me.firstName }} {{ me.lastName }} </span>
                    <span v-else>
                        {{ me.email }}
                    </span>
                    <div v-if="me.firstName" class="dark:text-gray-500 text-gray-400">
                        {{ me.email }}
                    </div>
                    <div class="mt-1">
                        <RoleBadge
                            v-if="CurrentUserStore.me?.role"
                            :role="CurrentUserStore.me.role"
                        />
                    </div>
                </div>
            </div>
        </UCard>
        <div class="flex flex-row gap-2">
            <InputString
                :label="$t('input.label.firstName')"
                name="firstName"
                v-model="state.firstName"
                icon="i-tabler-user-circle"
            />
            <InputString
                :label="$t('input.label.lastName')"
                name="lastName"
                v-model="state.lastName"
                icon="i-tabler-user-circle"
            />
        </div>
        <InputEmail v-model="state.email" required />
        <div class="flex flex-row gap-2">
            <InputString
                :label="$t('input.label.location')"
                name="location"
                v-model="state.location"
                icon="i-tabler-map-pin"
            />
            <InputString
                :label="$t('input.label.title')"
                name="title"
                v-model="state.title"
                icon="i-tabler-text-size"
            />
        </div>
        <InputDescription v-model="state.description" />
        <InputTag v-model="state.tags" />
        <UFormGroup :label="$t('input.label.avatar')" name="avatar">
            <UButtonGroup>
                <UInput type="file" @change="avatarFile = $event.item(0) ?? null" accept="image/*">
                    <template #leading v-if="currentAvatar">
                        <img :src="currentAvatar" class="aspect-square h-5 rounded" />
                    </template>
                </UInput>
                <UButton
                    :loading="isPending"
                    @click="removeAvatar"
                    icon="i-tabler-trash"
                    color="gray"
                />
            </UButtonGroup>
        </UFormGroup>
        <UButton type="submit">{{ $t("action.save") }}</UButton>
    </UForm>
</template>
<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import useCurrentUserStore from "~/stores/currentUserStore";
import useTagStore from "~/stores/tagStore";
import type { UserUpdate } from "~/types/user";

definePageMeta({
    minRequiredRole: Role.Author,
});

const CurrentUserStore = useCurrentUserStore();
const TagStore = useTagStore();
const AuthService = useAuthService();
const toast = useToast();
const { t } = useI18n();

const state = ref<UserUpdate>({
    email: "",
    firstName: "",
    lastName: "",
    location: "",
    title: "",
    description: "",
    tags: [],
});
const me = computed(() => ({
    email: CurrentUserStore.me?.email ?? "",
    firstName: CurrentUserStore.me?.firstName ?? "",
    lastName: CurrentUserStore.me?.lastName ?? "",
    location: CurrentUserStore.me?.location ?? "",
    title: CurrentUserStore.me?.title ?? "",
    description: CurrentUserStore.me?.description ?? "",
    tags: CurrentUserStore.me?.tags ?? [],
}));
syncRefs(me, state);

const avatarFile = ref<File | null>(null);
const currentAvatar = computed(() => CurrentUserStore.me?.avatar ?? "");

const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async () => {
        if (avatarFile.value) {
            await AuthService.me.updateAvatar({ avatar: avatarFile.value });
        }
        await AuthService.me.updateProfile(state.value);
    },
    onSuccess() {
        toast.add(createSuccessNotification(t("statusMessage.success.profile")));
        CurrentUserStore.fetchMe();
        TagStore.fetchTags();
    },
});

const { mutate: removeAvatar } = useMutation({
    mutationFn: () => AuthService.me.removeAvatar(),
    onSuccess() {
        toast.add(createSuccessNotification(t("statusMessage.success.removeAvatar")));
        CurrentUserStore.fetchMe();
    },
});
</script>
