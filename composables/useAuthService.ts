import type { UserUpdate, UserUpdatePassword } from "~/types/user";
import { fetchApi } from "~/utils/api";

export default function useAuthService() {
    const appConfig = useAppConfig();
    return {
        resetPassword(body: { token: string; password: string; confirmPassword: string }) {
            return fetchApi("/api/rest/password_reset/reset", {
                method: "POST",
                body,
            });
        },
        checkPasswordResetToken(token: string) {
            return fetchApi("/api/rest/password_reset/token_check", {
                method: "GET",
                query: {
                    token,
                },
            });
        },
        requestPasswordReset(email: string) {
            return fetchApi("/api/rest/password_reset/request", {
                method: "POST",
                body: { email },
            });
        },
        login(email: string, password: string) {
            return fetchApi("/api/rest/auth/login", {
                method: "POST",
                body: {
                    email,
                    password,
                },
            });
        },
        checkAuth() {
            return fetchApi("/api/rest/auth/check", {
                method: "GET",
            });
        },
        checkRoutePermission(route: string, exact = false, currentRole?: Role | "public"): boolean {
            return matchRoutes(appConfig.roles, currentRole ?? "public", route, exact);
        },
        me: {
            async fetch() {
                const result = await fetchApi("/api/rest/users/me", {
                    method: "GET",
                });
                if (!result?.user) return null;
                return result.user;
            },
            updateTheme(value: "light" | "dark") {
                return fetchApi("/api/rest/settings/preferences", {
                    method: "POST",
                    body: { theme: value },
                });
            },
            updateLanguage(value: "en" | "de") {
                return fetchApi("/api/rest/settings/preferences", {
                    method: "POST",
                    body: { language: value },
                });
            },
            logout() {
                return fetchApi("/api/rest/auth/logout", {
                    method: "POST",
                });
            },
            updateProfile(data: UserUpdate) {
                return fetchApi("/api/rest/users/me", {
                    method: "PUT",
                    body: data,
                });
            },
            updateAvatar(data: {
                avatar: File;
            }) {
                const formData = new FormData();
                formData.append("avatar", data.avatar);
                return fetchApi("/api/rest/users/me/avatar", {
                    method: "POST",
                    body: formData,
                });
            },
            removeAvatar() {
                return fetchApi("/api/rest/users/me/avatar", {
                    method: "DELETE",
                });
            },
            updatePassword(data: UserUpdatePassword) {
                return fetchApi("/api/rest/users/me/password", {
                    method: "PUT",
                    body: data,
                });
            },
            checkActionPermission(
                resource: "user",
                action: "create",
                currentRole?: Role,
                currentUserId?: string,
                resourceCreatedBy?: string,
            ): boolean {
                return matchActions(
                    appConfig.roles,
                    currentRole ?? "public",
                    resource,
                    action,
                    currentUserId,
                    resourceCreatedBy,
                );
            },
        },
    };
}
