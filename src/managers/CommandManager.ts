import { Command } from "@/interfaces";

const commands = new Map<string, Command>();

commands.set("ping", new (await import("@/commands/ping")).default());

export { commands };