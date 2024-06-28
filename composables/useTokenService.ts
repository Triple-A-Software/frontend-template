export default function useTokenService() {
    return {
        createOne(name: string) {
            return fetchApi("/api/rest/tokens", {
                method: "POST",
                body: { name },
            });
        },
        deleteOne(id: number) {
            return fetchApi(`/api/rest/tokens/${id}`, {
                method: "DELETE",
            });
        },
        getAll() {
            return fetchApi("/api/rest/tokens", { method: "GET" });
        },
    };
}
