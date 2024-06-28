<template>
    <Title>{{ $t("page.logout.title") }}</Title>
    <AuthWrapper
        :title="$t('page.logout.title')"
        :description="$t('page.logout.description')"
        :state="{}"
    >
        <UButton to="/login">{{ $t("action.login") }}</UButton>
    </AuthWrapper>
</template>
<script setup lang="ts">
import useCurrentUserStore from "~/stores/currentUserStore";

definePageMeta({
    layout: "auth",
    minRequiredRole: Role.Public,
});

const CurrentUserStore = useCurrentUserStore();

onMounted(() => {
    CurrentUserStore.logout();
});
</script>
