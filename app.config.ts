import { Role } from "./utils/roles";

const authorRoutes = ["/", "/users/*"];
const editorRoutes = authorRoutes.concat(["/settings", "/settings/*"]);
const contributorRoutes = editorRoutes.concat([]);

export default defineAppConfig({
    ui: {
        primary: "green",
        gray: "zinc",
        notifications: {
            position: "bottom-0 right-0",
        },
        table: {
            default: {
                emptyState: {
                    icon: "i-tabler-database",
                },
                loadingState: {
                    icon: "i-tabler-refresh",
                },
                sortButton: {
                    icon: "i-tabler-arrows-sort",
                },
                sortAscIcon: "i-tabler-sort-ascending-letters",
                sortDescIcon: "i-tabler-sort-descending-letters",
            },
        },
        selectMenu: {
            default: {
                selectedIcon: "i-tabler-check",
            },
        },
        select: {
            default: {
                loadingIcon: "i-tabler-refresh",
                trailingIcon: "i-tabler-chevron-down",
            },
        },
        commandPalette: {
            default: {
                icon: "i-tabler-search",
                loadingIcon: "i-tabler-refresh",
                emptyState: {
                    icon: "i-tabler-database",
                },
                selectedIcon: "i-tabler-check",
            },
        },
        pagination: {
            default: {
                nextButton: {
                    icon: "i-tabler-chevron-right",
                },
                prevButton: {
                    icon: "i-tabler-chevron-left",
                },
                lastButton: {
                    icon: "i-tabler-chevrons-right",
                },
                firstButton: {
                    icon: "i-tabler-chevrons-left",
                },
            },
        },
    },
    user: {
        defaultColumns: [
            "email",
            "firstName",
            "lastName",
            "title",
            "onlineStatus",
            "role",
            "actions",
        ] as UserColumn[],
    },
    roles: [
        {
            key: Role.Admin,
            label: "common.role.admin",
            translateLabel: true,
            color: "red",
            routes: ["*"],
            actions: {
                "*": ["*"],
                // this is where you can define allowed actions for each role
            },
        },
        {
            key: Role.Editor,
            label: "common.role.editor",
            translateLabel: true,
            color: "orange",
            routes: editorRoutes,
            actions: {},
        },
        {
            key: Role.Contributor,
            label: "common.role.contributor",
            translateLabel: true,
            color: "yellow",
            routes: contributorRoutes,
            actions: {},
        },
        {
            key: Role.Author,
            label: "common.role.author",
            translateLabel: true,
            color: "green",
            routes: authorRoutes,
            actions: {},
        },
    ],
    appName: "Nuxt Frontend", // Update name here
});
