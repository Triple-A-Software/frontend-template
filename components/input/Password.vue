<template>
    <UFormGroup
        :label="label ?? $t('input.label.password')"
        :required="required"
        :name="name ?? 'password'"
    >
        <UInput
            :name="name ?? 'password'"
            :required="required"
            type="password"
            v-model="value"
            icon="i-tabler-lock"
        />
    </UFormGroup>
</template>
<script setup lang="ts">
defineProps<{
    required?: boolean;
    label?: string;
    name?: string;
}>();
const value = defineModel<string>();
</script>
