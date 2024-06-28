export default function useUserStatus(userId: string) {
    const { t } = useI18n();

    const label = computed(
        () =>
            (socket.data.value?.onlineStatus != null &&
                t(`common.onlineStatus.${socket.data.value?.onlineStatus}`)) ||
            "",
    );

    const socketUrl = computed(
        () => `${isProtocolSecure() ? "wss" : "ws"}://${getHost()}/api/ws/user/status?id=${userId}`,
    );
    const socket = useParsedWebSocket<{
        onlineStatus: "online" | "offline" | "away" | "do_not_disturb";
        lastAcitiveAt: string;
    }>(socketUrl, {
        autoReconnect: true,
    });

    const color = computed(() => {
        switch (socket.data.value?.onlineStatus) {
            case "online":
                return "green";
            case "offline":
                return "gray";
            case "away":
                return "orange";
            case "do_not_disturb":
                return "red";
        }
    });

    const bgColor = computed(() => {
        switch (socket.data.value?.onlineStatus) {
            case "online":
                return "bg-green-500";
            case "offline":
                return "bg-gray-500";
            case "away":
                return "bg-orange-500";
            case "do_not_disturb":
                return "bg-red-500";
        }
    });

    return {
        color,
        bgColor,
        label,
        socket,
    };
}
