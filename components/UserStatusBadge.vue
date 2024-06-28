<template>
    <UBadge v-if="socket.data.value?.onlineStatus" size="xs" :label="label" :color="color" />
    <USkeleton v-else class="h-4 w-12" />
</template>
<script setup lang="ts">
const props = defineProps<{
    userId: string;
}>();

const { socket, label, color } = useUserStatus(props.userId);
</script>
