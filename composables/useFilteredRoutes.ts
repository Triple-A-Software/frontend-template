import useCurrentUserStore from "~/stores/currentUserStore";

type Route = {
    label: string;
    icon: string;
    to: string;
    exact: boolean;
};
export default function useFilteredRoutes(routes: ComputedRef<Route[]>) {
    const authService = useAuthService();
    const CurrentUserStore = useCurrentUserStore();
    return computedAsync(async () => {
        const filtered: typeof routes.value = [];
        for (const route of routes.value) {
            if (
                authService.checkRoutePermission(route.to, route.exact, CurrentUserStore.me?.role)
            ) {
                filtered.push(route);
            }
        }
        return filtered;
    });
}
