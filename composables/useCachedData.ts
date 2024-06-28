export default function useCachedData<TReturn>(
    key: Parameters<typeof useAsyncData<TReturn>>[0],
    fn: Parameters<typeof useAsyncData<TReturn>>[1],
    options?: Parameters<typeof useAsyncData<TReturn>>[2],
) {
    const lazy = useAsyncData(key, fn, options);
    const data = computed(() => ({
        data: lazy.data.value,
        pending: lazy.pending.value,
    }));
    const cached = useCached(data, (a, b) => !a.pending && !b.pending);
    const cachedData = computed(() => cached.value.data);
    return {
        ...lazy,
        data: cachedData,
    };
}
