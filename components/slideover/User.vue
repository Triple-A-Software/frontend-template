<template>
    <USlideover v-model="open" :ui="{ width: 'max-w-max w-screen' }">
        <UForm :state="formState" @submit="save" class="h-full">
            <UCard
                class="flex flex-col flex-1 h-full"
                :ui="{
                    body: { base: 'flex-1' },
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            {{
                                id
                                    ? $t("slideover.user.title.edit")
                                    : $t("slideover.user.title.new")
                            }}
                        </h3>
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-tabler-x"
                            class="-my-1"
                            @click="open = false"
                        />
                    </div>
                </template>
                <div class="space-y-2 w-max">
                    <FormUser v-model="state" />
                    <FormNewUser v-if="id == null" v-model="newUserState" />
                </div>
                <template #footer>
                    <UButton type="submit">{{ $t("action.save") }}</UButton>
                </template>
            </UCard>
        </UForm>
    </USlideover>
</template>
<script setup lang="ts">
import type { UserUpdate } from "~/types/user";

const appConfig = useAppConfig();

const defaultState: UserUpdate = {
    email: "",
    firstName: null,
    lastName: null,
    location: null,
    title: null,
    description: null,
    tags: [],
};
const defaultNewUserState = {
    password: "",
    role: roleToString(appConfig.roles[0].key),
};

const toast = useToast();
const { t } = useI18n();
const userService = useUserService();

const emit = defineEmits<{
    (e: "save"): void;
}>();
const open = defineModel<boolean>("open", { required: true });
const id = defineModel<string>("userId");
const state = ref({
    ...defaultState,
});
const newUserState = ref({
    ...defaultNewUserState,
});
const formState = computed(() => {
    if (id.value) {
        return state.value;
    }
    return {
        ...state.value,
        ...newUserState.value,
    };
});
const fetched = useAsyncData(
    async () => {
        if (id.value) {
            return userService.getById(id.value);
        }
        return null;
    },
    {
        watch: [id],
    },
);
watch(open, (value) => {
    if (!value) {
        state.value = { ...defaultState };
        newUserState.value = { ...defaultNewUserState };
        id.value = undefined;
    }
});
watch(fetched.data, (value) => {
    if (value && id) {
        state.value = {
            email: value.email,
            firstName: value.firstName,
            lastName: value.lastName,
            location: value.location,
            title: value.title,
            description: value.description,
            tags: value.tags,
        };
    }
});

function close() {
    id.value = undefined;
    open.value = false;
}

async function save() {
    if (id.value) {
        try {
            await userService.updateOne(id.value, state.value);
            toast.add(createSuccessNotification(t("statusMessage.success.update")));
            close();
            emit("save");
        } catch (error) {
            toast.add(createErrorNotification(t("statusMessage.error.update")));
            return;
        }
    } else {
        const data = {
            ...state.value,
            ...newUserState.value,
        };

        try {
            await userService.createOne(data);
            toast.add(createSuccessNotification(t("statusMessage.success.create")));
            close();
            emit("save");
        } catch (error) {
            toast.add(createErrorNotification(t("statusMessage.error.create")));
            return;
        }
    }
}
</script>
