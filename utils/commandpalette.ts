import type { Command as CommandPaletteCommand, Group as CommandPaletteGroup } from "#ui/types";

export type Option = CommandPaletteCommand & {
    id: string;
    label: string;
    to: string;
    click: () => void;
    keywords: string[];
};

type OptionWithRequiredFields = Partial<Option> & Pick<Option, "label" | "id">;

type GroupData = {
    key: string;
    label?: string;
    commands?: Command<OptionWithRequiredFields>[];
    search?: (query: string) => Promise<CommandData[]>;
};

type CommandData = Partial<Option> & { id: string };

export class Group<TData extends GroupData = GroupData> {
    private data: TData;
    constructor(key: string) {
        this.data = {
            key,
        } as TData;
    }

    label(label: string): Group<
        TData & {
            label: string;
        }
    > {
        this.data.label = label;
        return this as Group<
            TData & {
                label: string;
            }
        >;
    }

    commands(
        commands: Array<Command<OptionWithRequiredFields> | undefined>,
    ): Group<TData & { commands: Command<OptionWithRequiredFields>[] }> {
        if (this.data.commands) {
            this.data.commands = this.data.commands.concat(
                commands.filter(Boolean) as Command<OptionWithRequiredFields>[],
            );
        } else {
            this.data.commands = commands.filter(Boolean) as Command<OptionWithRequiredFields>[];
        }
        return this as Group<TData & { commands: Command<OptionWithRequiredFields>[] }>;
    }

    command(
        command: Command<OptionWithRequiredFields>,
    ): Group<TData & { commands: Command<OptionWithRequiredFields>[] }> {
        if (!this.data.commands) {
            this.data.commands = [command];
        } else {
            this.data.commands.push(command);
        }
        return this as Group<TData & { commands: Command<OptionWithRequiredFields>[] }>;
    }

    search(
        handler: (query: string) => Promise<CommandData[]>,
    ): Group<TData & { search: (q: string) => Promise<CommandData[]> }> {
        this.data.search = handler;
        return this as Group<TData & { search: (q: string) => Promise<CommandData[]> }>;
    }

    toGroup(): CommandPaletteGroup {
        return {
            key: this.data.key,
            label: this.data.label ?? "",
            commands: this.data.commands?.map((c) => c.toCommand()),
            search: this.data.search,
        };
    }
}

export class Command<
    TData extends Partial<Option> & { id: string } = Partial<Option> & { id: string },
> {
    private data: TData & { id: string };
    constructor(id: string | number) {
        this.data = {
            id: String(id),
        } as TData & { id: string };
    }

    label(label: string): Command<TData & { label: string }> {
        this.data.label = label;
        return this as Command<TData & { label: string }>;
    }

    icon(icon: `i-${string}`): Command<TData & { icon: `i-${string}` }> {
        this.data.icon = icon;
        return this as Command<TData & { icon: `i-${string}` }>;
    }

    keywords(keywords: string[]): Command<TData & { keywords: string[] }> {
        this.data.keywords = keywords;
        return this as Command<TData & { keywords: string[] }>;
    }

    to(to: string): Command<TData & { to: string }> {
        this.data.to = to;
        return this as Command<TData & { to: string }>;
    }

    click(handler: () => void): Command<TData & { click: () => void }> {
        this.data.click = handler;
        return this as Command<TData & { click: () => void }>;
    }

    toCommand(): TData {
        return {
            id: this.data.id,
            label: this.data.label ?? "",
            icon: this.data.icon,
            keywords: this.data.keywords,
            to: this.data.to,
            click: this.data.click,
        } as TData;
    }
    /* 
        toComputedCommand(t: ComposerTranslation): ComputedRef<TData> {
            return computed(() => {
                let label: string | undefined;
                if (this.translateLabel && this.data.label) {
                    label = t(this.data.label);
                } else if (this.data.label) {
                    label = this.data.label;
                }
                return {
                    id: this.data.id,
                    label: this.data.label ? t(this.data.label) : "",
                    icon: this.data.icon,
                    keywords: this.data.keywords,
                    to: this.data.to,
                    click: this.data.click,
                } as TData;
            });
        }  */
}
