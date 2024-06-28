<template>
    <UCommandPalette
        :ref="commandPaletteRef as unknown as VNodeRef"
        :groups="groups"
        @update:model-value="onSelect"
        :fuse="{
            fuseOptions: {
                includeMatches: true,
                keys: ['keywords', 'label'],
            },
            resultLimit: 10,
        }"
    />
</template>
<script setup lang="ts">
import type CommandPalette from "#ui/components/navigation/CommandPalette.vue";
import type { VNodeRef } from "vue";

const emit = defineEmits<{
    (e: "close"): void;
}>();

const Router = useRouter();

const commandPaletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);
const query = computed(() => commandPaletteRef.value?.query);

const { groups, recentSearches } = useCommandPaletteGroups(query);

function onSelect(option: Option) {
    if (option.to) {
        Router.push(option.to);
    }
    option.click?.();
    if (!option.click) {
        const currentRank = recentSearches.value.get(option.id)?.rank ?? 0;
        recentSearches.value.set(option.id, {
            rank: currentRank + 1,
            option,
        });
    }
    emit("close");
}
</script>
