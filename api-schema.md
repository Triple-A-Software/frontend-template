# API-schema

## Routes-overview

- /files
    - /avatar
        - /:userId
- /api
    - /rest
        - /setup
            - /is_setup_finished GET
            - /create_admin_user POST
        - /permissions
            - /adminPage GET
            - /action GET
        - /auth
            - /check GET
            - /logout POST
            - /login POST
        - /password_reset
            - /request POST
            - /token_check GET
            - /reset POST
        - /users GET
            - /:userId GET, PUT, DELETE, POST
                - /password PUT
                - /avatar POST, DELETE
            - /search GET
        - /activity GET
        - /settings
            - /preferences POST
        - /tags GET
        - /tokens POST, GET
            - /:tokenId DELETE
        - /sessions GET
            - /:sessionId DELETE
    - /ws
        - /user
            - /status WS
            - /me
                - /status WS

## General things

The return type of any route, which returns json data should be an object with the output from the route merged with this:
```typescript
{
    _metadata: {
        totalCount?: number; // every route which returns multiple of one thing, should count the total amount of the things it could return (without pagination, but with filtering) and put it here
        firstIndexOnPage?: number;
        lastIndexOnPage?: number;
        timestamp: number;
    };
}
```

## /files/avatar/:userId

Returns the avatar image for the user with the given id.

Method: GET

Params:
```typescript
{
    userId: string;
}
```
Output: The avatar image file data

## /api/rest/setup/is_setup_finished

Returns a boolean for whether the setup has been completed and the admin user has been created.

Method: GET

Accessibility: this route should be publicly accessible

Output:
```typescript
{
    setupFinished: boolean;
}
```
## /api/rest/setup/create_admin_user

Creates the admin user with the given email, password, first name and last name.

Method: POST

Accessibility: this route should be publicly accessible, but denied when the setup has already been finished

Body:
```typescript
{
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    confirmPassword: string;
}
```
Output:
```typescript
{
    success: boolean;
}
```

## /api/rest/permissions/adminPage

Returns a boolean for whether the current user's role has access to the requested admin route.

Method: GET

Query:
```typescript
{
    page: string; // the routes path i.e. "/users/..."
    exact: boolean; // "true" or "false"
}
```
Output:
```typescript
{
    allowed: boolean;
}
```

## /api/rest/permissions/action

Returns a boolean whether the current user's role can perform the requested action on the requested resource.

Method: GET

Query:
```typescript
{
    action: "create"; // this is the action the user is trying to do
    resource: "user"; // a string for the resource the user is trying to access
}
```
Output:
```typescript
{
    allowed: boolean;
}
```

## /api/rest/auth/check

Returns a boolean which is true if the user is authenticated via a cookie and false otherwise.

Method: GET

Output:
```typescript
{
    authenticated: boolean;
}
```

## /api/rest/auth/logout

Logs the user out (deletes the cookie) and returns a boolean whether this has succeeded.

Method: POST

Output:
```typescript
{
    success: boolean;
}
```

## /api/rest/auth/login

Logs the user in and returns a boolean whether this has succeeded.

Method: POST

Body:
```typescript
{
    email: string;
    password: string;
}
```
Output:
```typescript
{
    success: boolean;
}
```

## /api/rest/password_reset/request

Creates a passwort reset request for the user with the given email and sends an email with the password reset link. Returns a success boolean.

Method: POST

Body:
```typescript
{
    email: string;
}
```
Output:
```typescript
{
    success: boolean;
}
```

## /api/rest/password_reset/token_check

Checks whether the token is valid and returns a boolean.

Method: GET

Query:
```typescript
{
    token: string;
}
```
Output:
```typescript
{
    isValid: boolean;
}
```

## /api/rest/password_reset/reset

Checks if the token is valid and if so, resets the password for the user associated with the given token and returns a success boolean.

Method: POST

Body:
```typescript
{
    token: string;
    password: string;
    confirmPassword: string;
}
```
Output:
```typescript
{
    success: boolean;
}
```

## /api/rest/users/:userId

Performs actions on a specific user.

Params:
This is the same for all methods on this route
```typescript
{
    userId: string;
}
```

Method: GET

Output:
```typescript
{
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        location: string | null;
        language: "en" | "de";
        description: string | null;
        title: string | null;
        role: string; // The role of the user, this can be any string, but should also be correctly configured in `app.config.ts`
        theme: "dark" | "light";
        avatar: string; // the image url of the avatar image for the user (should be: `/api/files/avatar/<userId>`)
        onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
        lastActiveAt: number; // the timestamp of the last time the user was active
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
        deletedAt: string | null;
        deletedBy: string | null;
        tags: Array<{
            id: number;
            title: string;
        }>;
    };
}
```

Method: PUT

Output:
```typescript
{
    updated: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        location: string | null;
        language: "en" | "de";
        description: string | null;
        title: string | null;
        role: string; // The role of the user, this can be any string, but should also be correctly configured in `app.config.ts`
        theme: "dark" | "light";
        avatar: string; // the image url of the avatar image for the user (should be: `/api/files/avatar/<userId>`)
        onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
        lastActiveAt: number; // the timestamp of the last time the user was active
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
        deletedAt: string | null;
        deletedBy: string | null;
    };
}
```
Method: DELETE

Output:
```typescript
{
    deleted: {
        id: string;
    };
}
```

## /api/rest/users/me/password

Updates the current users password.

Method: PUT

Body:
```typescript
{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
```
Output:
```typescript
{
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        location: string | null;
        language: "en" | "de";
        description: string | null;
        title: string | null;
        role: string; // The role of the user, this can be any string, but should also be correctly configured in `app.config.ts`
        theme: "dark" | "light";
        avatar: string; // the image url of the avatar image for the user (should be: `/api/files/avatar/<userId>`)
        onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
        lastActiveAt: number; // the timestamp of the last time the user was active
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
        deletedAt: string | null;
        deletedBy: string | null;
    };
}
```

## /api/rest/users/me/avatar

Updates the current users avatar.

Method: POST

Body:

This is form data.
```typescript
{
    avatar: File;
}
```
Output:
```typescript
{
    // TODO: what is this type?
}
```

Method: DELETE

Output:
```typescript
{
    // TODO: what is this type?
}
```

## /api/rest/users

GET lists all users. POST creates a new user.

Method: GET

Query:
```typescript
{
    page: number; // which page of pagination (starts at 1)
    limit: number; // how many users to return per page
    sortBy?: keyof User; // a key of the user table to sort by
    sortDirection?: "asc" | "desc";
    roles?: string; // a csv of roles to filter by (filter with `or`, not `and`)
}
```
Output:
```typescript
{
    users: Array<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        location: string | null;
        language: "en" | "de";
        description: string | null;
        title: string | null;
        role: string; // The role of the user, this can be any string, but should also be correctly configured in `app.config.ts`
        theme: "dark" | "light";
        avatar: string; // the image url of the avatar image for the user (should be: `/api/files/avatar/<userId>`)
        onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
        lastActiveAt: number; // the timestamp of the last time the user was active
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
    }>;
}
```
Method: POST

Body:
```typescript
{
    email: string;
    firstName: string | null;
    lastName: string | null;
    location: string | null;
    title: string | null;
    description: string | null;
    tags: Array<{
        id: number; // these are existing tags which should be connected with this user
    } | {
        label: string; // tags with only a label are new tags and should be created and then connected with this user
    }>;
    password: string;
    role: string | null; // if this is null, the backend should use the default role
}
```
Output:
```typescript
{
    created: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        location: string | null;
        language: "en" | "de";
        description: string | null;
        title: string | null;
        role: string; // The role of the user, this can be any string, but should also be correctly configured in `app.config.ts`
        theme: "dark" | "light";
        avatar: string; // the image url of the avatar image for the user (should be: `/api/files/avatar/<userId>`)
        onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
        lastActiveAt: number; // the timestamp of the last time the user was active
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
        deletedAt: string | null;
        deletedBy: string | null;
    };
}
```

## /api/rest/users/search

Searches for users. Should return users which match the query in whatever field you want.

Method: GET

Query:
```typescript
{
    q: string; // the search query
}
```
Output:
```typescript
{
    users: Array<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
    }>;
}
```

## /api/rest/activity

Returns the activity of the user with the given id.

Method: GET

Query:
```typescript
{
    userId: string;
    limit: number; // how many activities to return
    page: number; // which page of pagination (starts at 1)
}
```
Output:
```typescript
{
    activity: Array<{
        id: number;
        action: string;
        actionById: string;
        actionAt: string; // should be parseable to a Date object
        ipAddress: string | null;
        userAgent: string | null;
        table: string | null; // which table was affected by this activity
        itemId: string | null; which item on the table was affected
        oldData: any; // any Object
        newData: any; // any Object
        diff: Record<string, any>; // the difference object for the difference between oldData and newData
    }>;
}
```

## /api/rest/settings/preferences

Updates the current users preferences.

Method: POST

Body:
```typescript
{
    language?: "en" | "de";
    theme?: "light" | "dark";
}
```
Output:
```typescript
{
    updated: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        location: string | null;
        language: "en" | "de";
        description: string | null;
        title: string | null;
        role: string; // The role of the user, this can be any string, but should also be correctly configured in `app.config.ts`
        theme: "dark" | "light";
        avatar: string; // the image url of the avatar image for the user (should be: `/api/files/avatar/<userId>`)
        onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
        lastActiveAt: number; // the timestamp of the last time the user was active

        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
        deletedAt: string | null;
        deletedBy: string | null;
    };
}
```

## /api/rest/tags

Returns all the tags that exist (without pagination).

Method: GET

Output:
```typescript
{
    tags: Array<{
        id: number;
        title: string;

        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
        createdBy: string; // the id of the user that created this user
        updatedBy: string; // the id of the user that updated this user
        deletedAt: string | null;
        deletedBy: string | null;
    }>;
}
```

## /api/rest/tokens

POST creates a new access token for the current user.

GET lists all the access tokens of the current user.

Method: POST

Body:
```typescript
{
    name: string;
}
```
Output:
```typescript
{
    created: {
        id: number;
        name: string | null;
        token: string; // the actual token, this is censored in the ui, it can only be copied to the clipboard
        userId: string; // the id of the user this token belongs to
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        updatedAt: string; // the date formatted as a string, which can be parsed to a Date object
    };
}
```
Method: GET

Output:
```typescript
{
    tokens: Array<{
        id: number;
        name: string | null;
        createdAt: string; // the date formatted as a string, which can be parsed to a Date object
        expiration: string | null; // the date formatted as a string, which can be parsed to a Date object (should be null here because access tokens don't have expiration)
    }>;
}
```

## /api/rest/tokens/:tokenId

Deletes the token with the given id from the current user.

Method: DELETE

Params:
```typescript
{
    tokenId: number;
}
```
Output:
```typescript
{
    deleted: boolean;
}
```

## /api/rest/sessions

Lists all the sessions for the current user.

Method: GET

Output:
```typescript
{
    sessions: Array<{
       session: {
           id: number;
           tokenId: number;
           ipAddress: string;
           userAgent: string;
           createdAt: string;
       };
       id: number; // this is the id of the token associated with the session
       createdAt: string; // the date formatted as a string, which can be parsed to a Date object
       expiration: string | null; // the date formatted as a string, which can be parsed to a Date object (this shouldn't be null here because session tokens have an expiration date)
    }>;
}
```

## /api/rest/sessions/:sessionId

Deletes a session with the given id from the current user.

Method: DELETE

Params:
```typescript
{
    sessionId: number;
}
```
Output:
```typescript
{
    deleted: boolean;
}
```

## /api/ws/user/status

A websocket connection to get a live updating status of a user.

Method: WS

Query:
```typescript
{
    id: string;
}
```
Output:
```typescript
{
    onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
    lastActiveAt: string | null;
}
```

## /api/ws/user/me/status

A websocket connection to update the current users status, which then gets published to the other user status websocket.

Method: WS

Body:
```typescript
{
    onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
}
```
Output:
```typescript
{
    onlineStatus: "offline" | "online" | "away" | "do_not_disturb";
}
```
