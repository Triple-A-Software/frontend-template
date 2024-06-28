<template>
    <Title>{{ $t("page.settings.general.title") }}</Title>
    <h1>General settings</h1>
</template>
<script setup lang="ts">
definePageMeta({
    minRequiredRole: Role.Author,
});
</script>
