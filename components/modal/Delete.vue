<template>
    <UModal v-model="open">
        <UCard>
            <div class="flex flex-row gap-2 items-center">
                <div class="i-tabler-trash"></div>
                <h1 class="text-2xl font-bold">
                    {{ $t("modal.delete.title") }}
                </h1>
            </div>
            <p>
                {{ $t("modal.delete.description", [name]) }}
            </p>
            <slot />
            <template #footer>
                <div class="space-x-2">
                    <UButton color="gray" icon="i-tabler-x" @click="open = false">
                        {{ $t("action.cancel") }}
                    </UButton>
                    <UButton color="red" icon="i-tabler-check" @click="confirm">
                        {{ $t("action.confirm") }}
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
<script setup lang="ts">
const props = defineProps<{
    name: string;
    id: string | number | null;
}>();
const open = defineModel<boolean>("open");
const emit = defineEmits<{
    (e: "confirm", id: string): void;
}>();

async function confirm() {
    if (!props.id) {
        open.value = false;
        return;
    }
    emit("confirm", String(props.id));
    open.value = false;
}
</script>
