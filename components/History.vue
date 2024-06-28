<template>
    <div class="flow-root">
        <ul>
            <li v-for="(item, index) in items" class="pb-4 relative">
                <span
                    v-if="items.length > index + 1"
                    class="absolute top-3 left-3 -ml-px h-full w-px bg-gray-200 dark:bg-gray-800"
                />
                <div class="flex flex-row gap-3 items-start">
                    <div
                        class="relative ring-4 ring-white dark:ring-gray-900 w-5 h-5 p-0.5 bg-white dark:bg-gray-900"
                    >
                        <UAvatar v-if="item.avatar" :src="item.avatar" />
                        <div
                            v-else-if="item.icon"
                            :class="item.icon"
                            class="text-gray-400 dark:text-gray-600"
                        />
                    </div>
                    <div class="flex text-sm w-full">
                        <div
                            v-if="item.label"
                            class="flex-1 flex flex-col gap-2"
                            :class="{
                                'mb-3': !!item.description,
                            }"
                        >
                            <slot name="label" :item="item">
                                <span>{{ item.label }}</span>
                            </slot>
                            <slot name="description" :item="item">
                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ item.description }}
                                </span>
                            </slot>
                        </div>
                        <div v-if="item.timestamp">
                            <slot name="timestamp" :item="item">
                                <span
                                    class="whitespace-nowrap text-xs justify-self-end text-gray-400"
                                >
                                    {{ item.timestamp }}
                                </span>
                            </slot>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts">
type Item = {
    avatar?: string;
    icon?: string;
    label?: string;
    description?: string;
    timestamp?: string | Date;
};

defineProps<{
    items: Item[];
}>();
</script>
