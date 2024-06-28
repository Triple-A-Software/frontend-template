<template>
    <div class="flex sm:flex-row flex-col gap-2">
        <InputPassword v-model="state.password" :required="true" />
        <InputRole v-model="state.role" :required="true" />
    </div>
</template>
<script setup lang="ts">
type Value = {
    password: string;
    role: Role;
};
const state = defineModel<Value>({ required: true });
</script>
