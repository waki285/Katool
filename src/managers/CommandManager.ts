import { Command } from "@/interfaces";
import { Collection } from "@discordjs/collection";

const commands = new Collection<string, Command>();

commands.set("ping", new (await import("@/commands/ping")).default());
commands.set("emoji_gen", new (await import("@/commands/emoji_gen")).default());

export { commands };
