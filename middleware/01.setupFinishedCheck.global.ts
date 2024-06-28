export default defineNuxtRouteMiddleware(async (to) => {
    const SetupService = useSetupService();
    const setupFinished = await SetupService.isSetupFinished();
    if (to.path === "/setup" && setupFinished?.setupFinished === true) {
        return navigateTo("/");
    }
    if (!setupFinished.setupFinished && to.path !== "/setup") {
        return navigateTo("/setup");
    }
});
