import useCurrentUserStore from "~/stores/currentUserStore";
import type { Group, Command as Option } from "#ui/types";

export const recentSearchesKey = "recentSearches";

export default function useCommandPaletteGroups(query: ComputedRef<string | undefined>) {
    const recentSearches = useLocalStorage<Map<string, { rank: number; option: Option }>>(
        recentSearchesKey,
        new Map(),
    );
    const sortedRecents = computed(() =>
        Array.from(recentSearches.value.values()).sort((a, b) => b.rank - a.rank),
    );

    const { t } = useI18n();
    const currentUserStore = useCurrentUserStore();
    const userService = useUserService();
    const authService = useAuthService();
    const actionPermissions = useAsyncData("actionPermissions", async () => {
        return {
            createUser: authService.me.checkActionPermission("user", "create"),
        };
    });

    const dataCommands = computed(() => {
        const group = new Group("data")
            .label("commandPalette.section.data")
            .commands([
                actionPermissions.data.value?.createUser
                    ? new Command("action.user.create")
                          .label(t("action.create.user"))
                          .icon("i-tabler-user-plus")
                          .keywords(["user"])
                          .to("/users?editing=true")
                    : undefined,
            ]);
        return group.toGroup();
    });
    const groups = computed<Group[]>(() => {
        const result: Group[] = [];
        if (!query.value) {
            result.push(
                new Group("recent")
                    .label(t("commandPalette.section.recent"))
                    .commands(
                        sortedRecents.value
                            .map(({ option }) =>
                                new Command(option.id)
                                    .label(t(option.label))
                                    .to(option.to)
                                    .icon(option.icon as `i-${string}`),
                            )
                            .slice(0, 3),
                    )
                    .toGroup(),
            );
        }
        const settingsGroup = new Group("settings")
            .label(t("commandPalette.section.settings"))
            .commands([
                new Command("navigate.account.profileSettings")
                    .label(t("navigation.label.profileSettings"))
                    .icon("i-tabler-user-cog")
                    .to("/profile"),
                new Command("navigate.profile.password")
                    .label(t("navigation.label.profile.password"))
                    .icon("i-tabler-lock")
                    .to("/profile/password"),
                new Command("navigate.profile.preferences")
                    .label(t("navigation.label.profile.preferences"))
                    .icon("i-tabler-settings")
                    .to("/profile/preferences"),
                new Command("navigate.profile.security")
                    .label(t("navigation.label.profile.security"))
                    .icon("i-tabler-lock-cog")
                    .to("/profile/security"),
            ]);
        const accountGroup = new Group("account")
            .label(t("commandPalette.section.account"))
            .commands([
                new Command("navigate.account.profile")
                    .label(t("navigation.label.viewProfile"))
                    .icon("i-tabler-user")
                    .to(`/users/${currentUserStore.me?.id}`),
                new Command("navigate.account.logout")
                    .label(t("navigation.label.logout"))
                    .icon("i-tabler-logout")
                    .keywords(["logout", "abmelden"])
                    .to("/logout"),
            ]);
        const themeGroup = new Group("theme").commands([
            new Command("action.theme.light")
                .label(t("common.theme.light"))
                .icon("i-tabler-sun")
                .keywords(["hell", "light"])
                .click(() => currentUserStore.updateTheme("light")),
            new Command("action.theme.dark")
                .label(t("common.theme.dark"))
                .icon("i-tabler-moon")
                .keywords(["dunkel", "dark"])
                .click(() => currentUserStore.updateTheme("dark")),
        ]);
        const languageGroup = new Group("language").commands([
            new Command("action.language.english")
                .label("English")
                .icon("i-tabler-language")
                .keywords(["englisch", "en"])
                .click(() => currentUserStore.updateLanguage("en")),
            new Command("action.language.german")
                .label("Deutsch")
                .icon("i-tabler-language")
                .keywords(["german", "de"])
                .click(() => currentUserStore.updateLanguage("de")),
        ]);
        const userSearchGroup = new Group("search.users")
            .label(t("commandPalette.section.search"))
            .search(async (q) => {
                if (!q) {
                    return [];
                }
                const users = await userService.search(q);
                return (
                    users?.users.map((u) => ({
                        id: u.id,
                        label: `${u.firstName} ${u.lastName}`,
                        suffix: u.email,
                        avatar: {
                            src: u.avatar ?? "",
                            alt: `${u.firstName} ${u.lastName}`,
                        },
                        keywords: [u.firstName, u.lastName, u.email].filter(Boolean) as string[],
                        to: `/users/${u.id}`,
                    })) ?? []
                );
            });
        result.push(dataCommands.value);
        result.push(settingsGroup.toGroup());
        result.push(accountGroup.toGroup());
        result.push(themeGroup.toGroup());
        result.push(languageGroup.toGroup());
        // TODO: show search results at the start of the list (research how to do this)
        result.push(userSearchGroup.toGroup());
        return result;
    });

    return {
        groups,
        recentSearches,
    };
}
