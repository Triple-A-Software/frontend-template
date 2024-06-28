export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) return; // in development, nuxt runs with a server, but this middleware can only run on the client. So we skip it on the server
    const AuthService = useAuthService();
    if (!to.name || to.meta.minRequiredRole === Role.Public) return;

    try {
        const result = await AuthService.checkAuth();
        if (!result?.authenticated) {
            return navigateTo("/login");
        }
    } catch (error) {
        return navigateTo("/login");
    }
    return;
});
