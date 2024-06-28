<template>
    <Title>{{ $t("page.login.title") }}</Title>
    <AuthWrapper :title="$t('page.login.title')" @submit="login()" :state="state">
        <InputEmail v-model="state.email" :required="true" />
        <InputPassword v-model="state.password" :required="true" />
        <p v-if="error" class="text-red-500 dark:text-red-400">
            {{ $t(`apiResponse.${error.message}`) }}
        </p>
        <UButton color="gray" variant="link" to="/forgot-password">
            {{ $t("action.forgotPassword") }}
        </UButton>

        <template #footer>
            <UButton type="submit" :loading="isPending">{{ $t("action.login") }}</UButton>
        </template>
    </AuthWrapper>
</template>
<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import useCurrentUserStore from "~/stores/currentUserStore";
const { t } = useI18n();

definePageMeta({
    layout: "auth",
    minRequiredRole: Role.Public,
});

const state = ref({
    email: "",
    password: "",
});

const AuthService = useAuthService();
const Router = useRouter();
const toast = useToast();
const CurrentUserStore = useCurrentUserStore();

const {
    mutate: login,
    isPending,
    error,
} = useMutation({
    mutationFn: () => AuthService.login(state.value.email, state.value.password),
    async onSuccess() {
        await CurrentUserStore.onLogin();
        toast.add(createSuccessNotification(t("statusMessage.success.login")));
        Router.push("/");
    },
});
</script>
