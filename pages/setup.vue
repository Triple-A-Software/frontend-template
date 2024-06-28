<template>
    <Title>{{ $t("page.setup.title") }}</Title>
    <AuthWrapper
        :title="$t('page.setup.title')"
        :state="state"
        :description="$t('page.setup.description')"
        @submit="createAdminUser()"
        :validate="validate"
    >
        <InputString
            v-model="state.firstName"
            name="firstname"
            icon="i-tabler-user-circle"
            :label="$t('input.label.firstName')"
        />
        <InputString
            v-model="state.lastName"
            name="lastname"
            icon="i-tabler-user-circle"
            :label="$t('input.label.lastName')"
        />
        <InputEmail :required="true" v-model="state.email" />
        <InputPassword :required="true" v-model="state.password" />
        <InputPassword
            :required="true"
            v-model="state.confirmPassword"
            :label="$t('input.label.confirmPassword')"
            name="confirmPassword"
        />
        <template #footer>
            <UButton type="submit" :loading="isPending">
                {{ $t("action.finishSetup") }}
            </UButton>
        </template>
    </AuthWrapper>
</template>
<script setup lang="ts">
import type { UnwrapRef } from "vue";
import type { FormError } from "#ui/types/form";
import { useMutation } from "@tanstack/vue-query";

definePageMeta({
    layout: "auth",
    minRequiredRole: Role.Public,
});

const { t } = useI18n();
const SetupService = useSetupService();
const Router = useRouter();
const toast = useToast();

const state = ref({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
});

function validate(values: UnwrapRef<typeof state>) {
    const errors: FormError[] = [];
    if (!values.email) {
        errors.push({ path: "email", message: t("statusMessage.error.required") });
    }
    if (!values.password) {
        errors.push({ path: "password", message: t("statusMessage.error.required") });
    }
    if (!values.confirmPassword) {
        errors.push({ path: "confirmPassword", message: t("statusMessage.error.required") });
    }
    if (values.password !== values.confirmPassword) {
        errors.push({
            path: "confirmPassword",
            message: t("statusMessage.error.passwordMismatch"),
        });
    }
    return errors;
}

const { mutate: createAdminUser, isPending } = useMutation({
    mutationFn: () => SetupService.createAdminUser(state.value),
    onSuccess() {
        toast.add(createSuccessNotification(t("statusMessage.success.setup")));
        Router.push("/login");
    },
    onError() {
        toast.add(createErrorNotification(t("statusMessage.error.setup")));
    },
});
</script>
