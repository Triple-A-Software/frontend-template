import type { DefaultTypes } from "./default-types";

export type Tag = {
    id: number;
    title: string;
} & DefaultTypes;

export type NewTag = {
    label: string;
};
