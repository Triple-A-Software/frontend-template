<template>
    <UFormGroup :label="$t('input.label.tags')" name="tags">
        <USelectMenu
            multiple
            searchable
            creatable
            :searchable-placeholder="$t('input.placeholder.search')"
            v-model="value"
            :options="TagStore.tags"
            icon="i-tabler-tag"
            by="id"
        >
            <template #label>
                <span v-if="value.length" class="truncate">
                    {{
                        value
                            .map((t) => (t && "label" in t ? `${t.label} (+)` : t?.title))
                            .join(", ")
                    }}
                </span>
                <span v-else>
                    {{ $t("input.placeholder.tags") }}
                </span>
            </template>
            <template #option="{ option }">
                {{ option.label || option.title }}
            </template>
            <template #option-create="{ option }">
                <span class="flex-shrink-0">{{ $t("action.newTag") }}:</span>
                <span class="block truncate">{{ option.label }}</span>
            </template>
        </USelectMenu>
    </UFormGroup>
</template>
<script setup lang="ts">
import useTagStore from "~/stores/tagStore";
import type { NewTag, Tag } from "~/types/tag";

const TagStore = useTagStore();

const value = defineModel<(Tag | NewTag)[]>({ default: [] });
</script>
