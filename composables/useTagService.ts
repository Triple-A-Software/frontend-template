export default function useTagService() {
    return {
        getAll() {
            return fetchApi("/api/rest/tags", {
                method: "GET",
            });
        },
    };
}
