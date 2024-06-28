import type { Notification } from "#ui/types";

export function createErrorNotification(
    message: string,
    description?: string,
): Partial<Notification> {
    return {
        color: "red",
        title: message,
        icon: "i-tabler-exclamation-circle",
        description,
    };
}

export function createSuccessNotification(
    message: string,
    description?: string,
): Partial<Notification> {
    return {
        color: "green",
        title: message,
        icon: "i-tabler-circle-check",
        description,
    };
}
