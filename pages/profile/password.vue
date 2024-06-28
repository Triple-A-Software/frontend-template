<template>
    <Title>{{ $t("page.profileSettings.password.title") }}</Title>
    <UForm :state="state" @submit="handleSubmit()" class="max-w-max space-y-3" :validate="validate">
        <InputPassword :required="true" v-model="state.currentPassword" />
        <InputPassword
            :required="true"
            v-model="state.newPassword"
            :label="$t('input.label.newPassword')"
            name="newPassword"
        />
        <InputPassword
            :required="true"
            v-model="state.confirmNewPassword"
            :label="$t('input.label.confirmPassword')"
            name="confirmPassword"
        />
        <UButton :loading="isPending" type="submit">
            {{ $t("action.save") }}
        </UButton>
    </UForm>
</template>
<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { FormError } from "#ui/types/form";
import { useMutation } from "@tanstack/vue-query";
import type { UserUpdatePassword } from "~/types/user";

definePageMeta({
    minRequiredRole: Role.Author,
});

const AuthService = useAuthService();
const { t } = useI18n();
const toast = useToast();

const state = ref<UserUpdatePassword>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
});

const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: () => AuthService.me.updatePassword(state.value),
    onSuccess() {
        toast.add(createSuccessNotification(t("statusMessage.success.passwordChange")));
    },
    onError() {
        toast.add(createErrorNotification(t("statusMessage.error.passwordChange")));
    },
});

function validate(values: UnwrapRef<typeof state>) {
    const errors: FormError[] = [];
    if (values.newPassword !== values.confirmNewPassword) {
        errors.push({
            path: "confirmNewPassword",
            message: t("statusMessage.error.passwordMismatch"),
        });
    }
    return errors;
}
</script>
