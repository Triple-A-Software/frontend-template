export default function useSessionService() {
    return {
        deleteOne(id: number) {
            return fetchApi(`/api/rest/sessions/${id}`, {
                method: "DELETE",
            });
        },
        getAll() {
            return fetchApi("/api/rest/sessions", { method: "GET" });
        },
    };
}
