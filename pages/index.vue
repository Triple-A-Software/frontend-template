<template>
    <Title>{{ $t("page.dashboard.title") }}</Title>
    <div>
        <h1>Dashboard</h1>
        <UButton @click="createAlert">add alert</UButton>
    </div>
</template>
<script setup lang="ts">
const toast = useToast();

definePageMeta({
    minRequiredRole: Role.Author,
});

function createAlert() {
    toast.add({
        title: Math.random().toString(),
    });
}
</script>
