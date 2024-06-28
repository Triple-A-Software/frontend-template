// USER fields
export type Status = "online" | "offline" | "away" | "do_not_disturb";
export type Theme = "light" | "dark";
export type Language = "en" | "de";
export type UserColumn =
    | "id"
    | "email"
    | "firstName"
    | "lastName"
    | "title"
    | "location"
    | "language"
    | "onlineStatus"
    | "role"
    | "createdAt"
    | "description"
    | "actions";

// MISC
export type Pagination = {
    page: number;
    limit: number;
};

// COMPOSABLES
export type Metadata = {
    totalCount?: number;
    firstIndexOnPage?: number;
    lastIndexOnPage?: number;
    timestamp?: number;
};

export type WithMetadata<T> = T & { _metadata: Metadata };
