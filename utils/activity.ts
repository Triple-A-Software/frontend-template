import type { ComposerTranslation } from "vue-i18n";

export function getActivityIcon(activity: { action: string }) {
    switch (activity.action) {
        case "create":
            return "i-tabler-plus";
        case "update":
            return "i-tabler-pencil";
        case "delete":
            return "i-tabler-trash";
        case "login":
            return "i-tabler-login";
        case "logout":
            return "i-tabler-logout";
        default:
            return "i-tabler-info-circle";
    }
}

export function getActivityLabel(
    activity: {
        action: string;
        newData: Record<string, unknown> | null;
        oldData: Record<string, unknown> | null;
        diff: Record<string, unknown> | null;
        itemId: string | null;
        tableName: string | null;
    },
    t: ComposerTranslation,
) {
    switch (activity.action) {
        case "create":
            return t("activity.label.create", [
                t(`recordName.${activity.tableName}`),
                activity.itemId ?? "",
            ]);
        case "update":
            return t("activity.label.update", [
                t(`recordName.${activity.tableName}`),
                activity.itemId ?? "",
            ]);
        default:
            return t(`activity.label.${activity.action}`);
    }
}

export function getActivityDescription(
    activity: {
        action: string;
        newData: Record<string, unknown> | null;
        oldData: Record<string, unknown> | null;
        diff: Record<string, { from: unknown; to: unknown }> | null;
        itemId: string | null;
        tableName: string | null;
    },
    t: ComposerTranslation,
) {
    switch (activity.action) {
        case "update":
            return Object.entries(activity.diff ?? {})
                .map(([field, diff]) =>
                    t("activity.description.update", [t(`field.${field}`), diff.from, diff.to]),
                )
                .join("\n");
        default:
            return undefined;
    }
}
