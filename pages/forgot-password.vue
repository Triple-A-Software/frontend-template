<template>
    <Title>{{ $t("page.forgotPassword.title") }}</Title>
    <AuthWrapper
        :title="$t('page.forgotPassword.title')"
        @submit="requestPasswordReset()"
        :state="state"
    >
        <InputEmail :required="true" v-model="state.email" />
        <template #footer>
            <UButton :loading="isPending" type="submit">{{ $t("action.submit") }}</UButton>
        </template>
    </AuthWrapper>
</template>
<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";

const AuthService = useAuthService();
const { t } = useI18n();

definePageMeta({
    layout: "auth",
    minRequiredRole: Role.Public,
});

const toast = useToast();

const state = ref({ email: "" });

const { mutate: requestPasswordReset, isPending } = useMutation({
    mutationFn: () => AuthService.requestPasswordReset(state.value.email),
    onSuccess() {
        toast.add(createSuccessNotification(t("statusMessage.success.passwordResetRequest")));
    },
    onError() {
        toast.add(createErrorNotification(t("statusMessage.error.passwordResetRequest")));
    },
});
</script>
