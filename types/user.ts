import type { DefaultTypes } from "./default-types";
import type { NewTag, Tag } from "./tag";

export type UserWithTags = User & {
    tags: Array<Tag>;
};

export type User = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    location: string | null;
    language: "en" | "de";
    description: string | null;
    title: string | null;
    role: string;
    theme: "dark" | "light";
    avatar: string;
    onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
    lastActiveAt: number;
} & DefaultTypes;

export type ListUser = Omit<User, "deletedAt" | "deletedBy">;

export type UserUpdate = Pick<
    User,
    "email" | "firstName" | "lastName" | "location" | "title" | "description"
> & {
    tags: (Tag | NewTag)[];
};
export type UserInsert = UserUpdate &
    Pick<User, "role"> & {
        password: string;
    };

export type UserSearchResult = Pick<User, "id" | "email" | "firstName" | "lastName" | "avatar">;

export type UserUpdatePassword = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};
