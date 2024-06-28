<template>
    <UFormGroup :label="$t('input.label.description')" name="description">
        <UTextarea name="description" v-model="value" />
    </UFormGroup>
</template>
<script setup lang="ts">
defineProps<{
    required?: boolean;
}>();
const value = defineModel<string>();
</script>
