import { useMutation } from "@tanstack/vue-query";
import { defineStore } from "pinia";

const useCurrentUserStore = defineStore(
    "user",
    () => {
        const AuthService = useAuthService();
        const colorMode = useColorMode();
        const toast = useToast();
        const { t, setLocale } = useI18n();

        const meData = useAsyncData("userStore:me", async () => {
            const user = await AuthService.me.fetch();
            if (user) {
                colorMode.preference = user.theme;
                setLocale(user.language);
                return {
                    ...user,
                    role: roleFromString(user.role),
                };
            }
            return null;
        });
        const me = computed(() => meData.data.value);

        function fetchMe() {
            meData.refresh();
        }

        const { idle } = useIdle();
        const manualStatus = useSessionStorage<Status>("manualStatus", "online");
        const automaticStatus = computed(() => (idle.value ? "away" : "online"));
        const currentStatus = computed(() =>
            manualStatus.value !== "online" ? manualStatus.value : automaticStatus.value,
        );

        const statusSocket = useParsedWebSocket<{
            onlineStatus: Status;
        }>(`${isProtocolSecure() ? "wss" : "ws"}://${getHost()}/api/ws/user/me/status`, {
            autoReconnect: {
                retries() {
                    return meData.data.value != null;
                },
            },
            onConnected() {
                pushStatus(currentStatus.value);
            },
        });
        watchOnce(statusSocket.data, (value) => {
            if (value) {
                if (!manualStatus.value) {
                    // there is currently no status saved in session storage, so this is a new session.
                    // We need to update our local status
                    manualStatus.value = value.onlineStatus;
                } else {
                    // otherwise, there's already a status set in session storage, so we just send that to the server, to update all other clients
                    pushStatus(currentStatus.value);
                }
            }
        });

        function updateStatus(value: Status) {
            manualStatus.value = value;
        }
        function pushStatus(value: Status) {
            statusSocket.send({
                onlineStatus: value,
            });
        }

        watch(currentStatus, (value) => pushStatus(value));

        const { mutate: updateTheme } = useMutation({
            mutationFn: async (value: "light" | "dark") => {
                colorMode.preference = value;
                await AuthService.me.updateTheme(value);
            },
            onSuccess() {
                toast.add(createSuccessNotification(t("statusMessage.success.theme")));
                fetchMe();
            },
        });

        const { mutate: updateLanguage } = useMutation({
            mutationFn: async (value: "en" | "de") => {
                setLocale(value);
                await AuthService.me.updateLanguage(value);
            },
            onSuccess() {
                toast.add(createSuccessNotification(t("statusMessage.success.language")));
                fetchMe();
            },
        });

        async function logout() {
            await AuthService.me.logout();
            statusSocket.close();
        }

        async function onLogin() {
            await meData.refresh();
            statusSocket.open();
            updateStatus(currentStatus.value);
        }

        return {
            me,
            fetchMe,
            updateTheme,
            updateLanguage,
            idle,
            status: currentStatus,
            updateStatus,
            logout,
            onLogin,
        };
    },
    {},
);

export default useCurrentUserStore;
