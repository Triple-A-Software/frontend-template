<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <UNotifications />
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/de";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const appConfig = useAppConfig();
const { t } = useI18n();

useSeoMeta({
    description: t("common.meta.description", [appConfig.appName]),
    titleTemplate: (title) => `${title} - ${appConfig.appName}`,
});
</script>
