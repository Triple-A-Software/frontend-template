export type Activity = {
    id: number;
    action: string;
    actionById: string;
    actionAt: string;
    ipAddress: string | null;
    userAgent: string | null;
    tableName: string | null;
    itemId: string | null;
    // biome-ignore lint/suspicious/noExplicitAny: the old data can be any table
    oldData: any;
    // biome-ignore lint/suspicious/noExplicitAny: the new data can be any table
    newData: any;
    // biome-ignore lint/suspicious/noExplicitAny: since the data can be from any table in the database, the diff can also be anything
    diff: Record<string, any>;
};
