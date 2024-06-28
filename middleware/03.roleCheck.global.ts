export default defineNuxtRouteMiddleware(async (to) => {
    const authService = useAuthService();
    if (!to.name || to.meta.minRequiredRole <= Role.Public) return;

    const currentUser = await authService.me.fetch();
    if (to.meta.minRequiredRole > roleFromString(currentUser?.role)) {
        console.log("not meeting required role");
        return abortNavigation();
    }
});
