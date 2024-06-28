import type { AppConfig } from "nuxt/schema";

export enum Role {
    Public = 0,
    Author = 1,
    Editor = 2,
    Contributor = 3,
    Admin = 4,
}

export function roleFromString(role: string | undefined) {
    switch (role?.toLowerCase()) {
        case "public":
            return Role.Public;
        case "author":
            return Role.Author;
        case "editor":
            return Role.Editor;
        case "contributor":
            return Role.Contributor;
        case "admin":
            return Role.Admin;
        default:
            return Role.Public;
    }
}

export function roleToString(role: Role) {
    switch (role) {
        case Role.Public:
            return "public";
        case Role.Author:
            return "author";
        case Role.Editor:
            return "editor";
        case Role.Contributor:
            return "contributor";
        case Role.Admin:
            return "admin";
    }
}

function globToRegex(glob: string) {
    const re = glob.replace("/", "\\/").replace("**", ".*").replace("/*", "/[^\\/]+");
    return new RegExp(`^${re}$`);
}

export function matchRoutes(
    roles: AppConfig["roles"],
    role: Role | "public",
    route: string,
    exact = false,
): boolean {
    const array = roles.find((r) => r.key === role)?.routes;
    if (!array) return false;
    if (array.includes("*")) {
        return true;
    }
    for (const item of array) {
        const glob = globToRegex(item);
        if (glob.test(route)) {
            return true;
        }
        if (exact && item === route) {
            return true;
        }
    }
    return false;
}

type Action = "create" | "read" | "update" | "delete" | string;
export function matchActions(
    roles: AppConfig["roles"],
    role: Role | "public",
    resource: string,
    action: Action,
    currentUserId?: string,
    resourceCreatedBy?: string,
): boolean {
    const actions = roles.find((r) => r.key === role)?.actions;
    if (!actions) return false;
    if (resource in actions) {
        const res = actions[resource as keyof typeof actions];
        if (res) {
            for (const item of res) {
                if (item === "*") return true;
                if (item === action) {
                    return true;
                }
                const [itemAction, condition] = item.split(":");
                if (itemAction === action && condition === "own") {
                    if (currentUserId === resourceCreatedBy) {
                        return true;
                    }
                }
            }
        }
    }
    if ("*" in actions) {
        const res = actions["*"];
        if (res) {
            for (const item of res) {
                if (item === "*") return true;
                if (item === action) {
                    return true;
                }
                const [itemAction, condition] = item.split(":");
                if (itemAction === action && condition === "own") {
                    if (currentUserId === resourceCreatedBy) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
