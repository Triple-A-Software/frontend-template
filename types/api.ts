import type { WithMetadata } from "~/utils/types";
import type { Activity } from "./activity";
import type { TokenWithSession } from "./session";
import type { Tag } from "./tag";
import type { Token } from "./token";
import type {
    ListUser,
    User,
    UserInsert,
    UserSearchResult,
    UserUpdate,
    UserUpdatePassword,
    UserWithTags,
} from "./user";

type API1 = {
    // AUTH
    "/api/rest/auth/check": {
        GET: {
            response: WithMetadata<{ authenticated: boolean }>;
        };
    };
    "/api/rest/permissions/route": {
        GET: {
            query: {
                route: string;
                exact: boolean;
            };
            response: WithMetadata<{ allowed: boolean }>;
        };
    };
    "/api/rest/permissions/action": {
        GET: {
            query: {
                resource: string;
                action: string;
            };
            response: WithMetadata<{ allowed: boolean }>;
        };
    };
    "/api/rest/auth/login": {
        POST: {
            body: {
                email: string;
                password: string;
            };
            response: WithMetadata<{ success: boolean }>;
        };
    };
    "/api/rest/auth/logout": {
        POST: {
            response: WithMetadata<{ success: boolean }>;
        };
    };

    // PASSWORD RESET
    "/api/rest/password_reset/request": {
        POST: {
            body: {
                email: string;
            };
            response: WithMetadata<{ success: boolean }>;
        };
    };
    "/api/rest/password_reset/reset": {
        POST: {
            body: {
                token: string;
                password: string;
                confirmPassword: string;
            };
            response: WithMetadata<{ success: boolean }>;
        };
    };
    "/api/rest/password_reset/token_check": {
        GET: {
            query: {
                token: string;
            };
            response: WithMetadata<{ isValid: boolean }>;
        };
    };

    // CURRENT USER
    "/api/rest/users/me": {
        GET: {
            response: WithMetadata<{ user: UserWithTags }>;
        };
        PUT: {
            body: UserUpdate;
            response: WithMetadata<{ update: User }>;
        };
    };
    "/api/rest/settings/preferences": {
        POST: {
            body: {
                language?: "en" | "de";
                theme?: "light" | "dark";
            };
            response: WithMetadata<{ update: User }>;
        };
    };
    "/api/rest/users/me/avatar": {
        POST: {
            body: FormData;
            response: WithMetadata<{ avatar: string }>;
        };
        DELETE: {
            response: WithMetadata<{ avatar: string }>;
        };
    };
    "/api/rest/users/me/password": {
        PUT: {
            body: UserUpdatePassword;
            response: WithMetadata<{ update: User }>;
        };
    };

    // TAGS
    "/api/rest/tags": {
        GET: {
            response: WithMetadata<{ tags: Tag[] }>;
        };
    };

    // USER
    "/api/rest/users": {
        GET: {
            query: {
                roles?: string[];
                limit: number;
                page: number;
                sortBy: UserColumn;
                sortDirection: "asc" | "desc";
            };
            response: WithMetadata<{ users: ListUser[] }>;
        };
        POST: {
            body: UserInsert;
            response: WithMetadata<{}>;
        };
    };
    "/api/rest/users/search": {
        GET: {
            query: {
                q: string;
            };
            response: WithMetadata<{ users: UserSearchResult[] }>;
        };
    };

    // SETUP
    "/api/rest/setup/is_setup_finished": {
        GET: {
            response: WithMetadata<{ setupFinished: boolean }>;
        };
    };
    "/api/rest/setup/create_admin_user": {
        POST: {
            body: Omit<UserInsert, "location" | "title" | "description" | "tags" | "role">;
            response: WithMetadata<{ created: User }>;
        };
    };

    // TOKENS
    "/api/rest/tokens": {
        GET: {
            response: WithMetadata<{
                tokens: Pick<Token, "id" | "name" | "createdAt" | "expiration">[];
            }>;
        };
        POST: {
            body: { name: string };
            response: WithMetadata<{ created: Omit<Token, "expiration"> }>;
        };
    };
    [path: `/api/rest/tokens/${string}`]: {
        DELETE: {
            response: WithMetadata<{ deleted: { id: string } }>;
        };
    };

    // SESSIONS
    "/api/rest/sessions": {
        GET: {
            response: WithMetadata<{ sessions: TokenWithSession[] }>;
        };
    };
    [path: `/api/rest/sessions/${string}`]: {
        DELETE: {
            response: WithMetadata<{ deleted: boolean }>;
        };
    };

    // ACTIVITY
    "/api/rest/activity": {
        GET: {
            query: {
                userId: string;
                limit: number;
                page: number;
            };
            response: WithMetadata<{ activity: Activity[] }>;
        };
    };
};

type API2 = {
    [path: `/api/rest/users/${string}`]: {
        GET: {
            response: WithMetadata<{ user: UserWithTags }>;
        };
        PUT: {
            body: UserUpdate;
            response: WithMetadata<{ updated: User }>;
        };
        DELETE: {
            response: WithMetadata<{ deleted: { id: string } }>;
        };
    };
};

export type API = API1 & API2;
