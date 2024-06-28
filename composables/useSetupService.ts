import type { UserInsert } from "~/types/user";

export default function useSetupService() {
    return {
        createAdminUser(
            user: Omit<UserInsert, "location" | "title" | "description" | "tags" | "role">,
        ) {
            return fetchApi("/api/rest/setup/create_admin_user", {
                method: "POST",
                body: user,
            });
        },
        isSetupFinished() {
            return fetchApi("/api/rest/setup/is_setup_finished", { method: "GET" });
        },
    };
}
