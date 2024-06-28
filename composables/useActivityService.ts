export default function useActivityService() {
    return {
        async getForUser(userId: string, pagination: { limit: number; page: number }) {
            return fetchApi("/api/rest/activity", {
                method: "GET",
                query: {
                    userId,
                    ...pagination,
                },
            });
        },
    };
}
