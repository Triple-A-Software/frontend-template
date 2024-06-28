<template>
    <UFormGroup :label="$t('input.label.role')" name="role" :required="required">
        <USelect
            v-model="value"
            :options="roles"
            option-attribute="label"
            :placeholder="$t('input.label.role')"
            :required="required"
        />
    </UFormGroup>
</template>
<script setup lang="ts">
const { t } = useI18n();

type Option = {
    value: Role;
    label: string;
};

const appConfig = useAppConfig();

defineProps<{
    required?: boolean;
}>();
const value = defineModel<string>();

const roles = computed<Option[]>(() =>
    appConfig.roles.map((r) => ({
        value: r.key,
        label: r.translateLabel ? t(r.label) : r.label,
    })),
);
</script>
