export default function useParsedWebSocket<TData extends {}>(
    url: Parameters<typeof useWebSocket>[0],
    options: Parameters<typeof useWebSocket>[1] = {},
) {
    const ws = useWebSocket<string>(url, options);
    const data = computed<TData | null>(() => (ws.data.value ? JSON.parse(ws.data.value) : null));
    function send(data: TData) {
        return ws.send(JSON.stringify(data));
    }
    return {
        ...ws,
        data,
        send,
    };
}
