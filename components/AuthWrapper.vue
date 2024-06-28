<template>
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
    <UForm :state="state" @submit="emit('submit', $event)" :validate="validate">
        <UCard class="not-prose">
            <div class="space-y-2">
                <slot />
            </div>
            <template #footer v-if="$slots.footer">
                <slot name="footer" />
            </template>
        </UCard>
    </UForm>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types/form";

const emit = defineEmits<{
    (e: "submit", event: FormSubmitEvent<unknown>): void;
}>();

defineProps<{
    title: string;
    description?: string;
    state: Record<string, unknown>;
    // biome-ignore lint/suspicious/noExplicitAny: anything else doesn't work
    validate?: (state: any) => FormError[];
}>();
</script>
