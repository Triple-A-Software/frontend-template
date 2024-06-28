<template>
    <UBadge
        size="xs"
        :label="role ? $t(`common.role.${roleToString(role)}`) : undefined"
        :color="roleColor(role)"
        variant="subtle"
    />
</template>
<script setup lang="ts">
defineProps<{
    role: Role;
}>();

const appConfig = useAppConfig();

function roleColor(role: Role) {
    return appConfig.roles.find((r) => r.key === role)?.color ?? "gray";
}
</script>
