export type TokenWithSession = {
    session: Session;
    id: number;
    createdAt: number | string;
    expiration: string | null;
};

type Session = {
    id: number;
    tokenId: string;
    ipAddress: string;
    userAgent: string;
    createdAt: number | string;
};
