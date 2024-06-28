<template>
    <UFormGroup :label="$t('input.label.email')" :required="required" name="email">
        <UInput name="email" type="email" :required="true" v-model="value" icon="i-tabler-mail" />
    </UFormGroup>
</template>
<script setup lang="ts">
defineProps<{
    required?: boolean;
}>();
const value = defineModel<string>();
</script>
