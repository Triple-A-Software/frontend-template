export type Created = {
    createdAt: number | string;
    createdBy: string;
};

export type Updated = {
    updatedAt: number | string;
    updatedBy: string;
};

export type Deleted = {
    deletedAt: number | string | null;
    deletedBy: string | null;
};

export type DefaultTypes = Created & Updated & Deleted;
