import { Action } from "@/interfaces";
import { Collection } from "@discordjs/collection";

const actions = new Collection<string, Action>();

actions.set("emojigen", new (await import("@/actions/emojigen")).default());
actions.set("emojigenModal", new (await import("@/actions/emojigenModal")).default());

export { actions };
