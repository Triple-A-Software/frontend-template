export type Token = {
    id: number;
    name: string;
    token: string;
    userId: string;
    sessionId: string | null;
    expiration: string | null;
    createdAt: number | string;
    updatedAt: number | string;
};
