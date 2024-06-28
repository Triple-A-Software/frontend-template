<template>
    <UFormGroup :label="label" :name="name" :required="required">
        <UInput :name="name" type="text" v-model="value" :icon="icon" />
    </UFormGroup>
</template>
<script setup lang="ts">
defineProps<{
    label: string;
    required?: boolean;
    name: string;
    icon?: `i-tabler-${string}`;
}>();
const value = defineModel<string>();
</script>
