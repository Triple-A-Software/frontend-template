<template>
    <Title>{{ $t("page.resetPassword.title") }}</Title>
    <AuthWrapper :title="$t('page.reset-password.title')" :state="state" @submit="resetPassword()">
        <InputPassword
            :required="true"
            v-model="state.password"
            :label="$t('input.label.newPassword')"
        />
        <InputPassword
            :required="true"
            v-model="state.confirmPassword"
            :label="$t('input.label.confirmPassword')"
            name="confirmPassword"
        />
        <template #footer>
            <UButton :loading="isPending" type="submit">{{ $t("action.resetPassword") }}</UButton>
        </template>
    </AuthWrapper>
</template>
<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";

definePageMeta({
    layout: "auth",
    minRequiredRole: Role.Public,
    middleware: [
        async (to) => {
            if (!("token" in to.query) || !to.query.token) {
                return navigateTo("/login");
            }
            // Check if token is valid
            try {
                const response = await AuthService.checkPasswordResetToken(
                    to.query.token.toString(),
                );
                if (!response.isValid) {
                    return navigateTo("/login");
                }
            } catch (error) {
                return navigateTo("/login");
            }
        },
    ],
});
const state = ref({
    password: "",
    confirmPassword: "",
});

const { t } = useI18n();
const { query } = useRoute();
const AuthService = useAuthService();
const toast = useToast();

const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: () =>
        AuthService.resetPassword({
            ...state.value,
            token: query.token?.toString() ?? "",
        }),
    onSuccess() {
        toast.add(createSuccessNotification(t("statusMessage.success.passwordReset")));
    },
    onError() {
        toast.add(createErrorNotification(t("statusMessage.error.passwordReset")));
    },
});
</script>
