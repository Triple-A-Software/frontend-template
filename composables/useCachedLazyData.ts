export default async function useCachedLazyData<TReturn>(
    key: Parameters<typeof useLazyAsyncData<TReturn>>[0],
    fn: Parameters<typeof useLazyAsyncData<TReturn>>[1],
    options?: Parameters<typeof useLazyAsyncData<TReturn>>[2],
) {
    const lazy = await useLazyAsyncData(key, fn, options);
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
