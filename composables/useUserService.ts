import type { UserInsert, UserUpdate } from "~/types/user";
import { fetchApi } from "~/utils/api";

export default function useUserService() {
    return {
        async getAll(
            roles: Role[],
            pagination: Pagination,
            sorting: { sortBy: UserColumn; sortDirection: "asc" | "desc" },
        ) {
            const query: {
                roles?: string[];
                limit: number;
                page: number;
                sortBy: UserColumn;
                sortDirection: "asc" | "desc";
            } = {
                ...pagination,
                ...sorting,
            };
            if (roles.length) {
                query.roles = roles.map((r) => roleToString(r));
            }
            const result = await fetchApi("/api/rest/users", {
                method: "GET",
                query,
            });
            return result ?? null;
        },
        search(query: string) {
            return fetchApi("/api/rest/users/search", {
                method: "GET",
                query: { q: query },
            });
        },
        async getById(id: string) {
            const data = await fetchApi(`/api/rest/users/${id}`, {
                method: "GET",
            });
            if (!data) return null;
            return data.user;
        },
        createOne(body: UserInsert) {
            return fetchApi("/api/rest/users", {
                method: "POST",
                body,
            });
        },
        updateOne(id: string, data: UserUpdate) {
            return fetchApi(`/api/rest/users/${id}`, {
                method: "PUT",
                body: data,
            });
        },
        deleteOne(id: string) {
            return fetchApi(`/api/rest/users/${id}`, {
                method: "DELETE",
            });
        },
    };
}
