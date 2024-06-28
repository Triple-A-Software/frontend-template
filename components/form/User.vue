<template>
    <div class="flex sm:flex-row flex-col gap-2">
        <InputString
            :label="$t('input.label.firstName')"
            name="firstName"
            v-model="state.firstName"
            icon="i-tabler-user-circle"
        />
        <InputString :label="$t('input.label.lastName')" name="lastName" v-model="state.lastName" icon="i-tabler-user-circle" />
    </div>
    <InputEmail v-model="state.email" required />
    <div class="flex sm:flex-row flex-col gap-2">
        <InputString :label="$t('input.label.location')" name="location" v-model="state.location" icon="i-tabler-map-pin" />
        <InputString :label="$t('input.label.title')" name="title" v-model="state.title" icon="i-tabler-text-size" />
    </div>
    <InputDescription v-model="state.description" />
    <InputTag v-model="state.tags" />
</template>
<script setup lang="ts">
import type { UserUpdate } from "~/types/user";

const state = defineModel<UserUpdate>({ required: true });
</script>
