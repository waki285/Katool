import { APIMessageComponentInteraction, APIInteractionResponseChannelMessageWithSource, APIInteractionResponseUpdateMessage } from "discord-api-types/v10";
import { Awaitable } from "./UtilityTypes";

export abstract class Action {
  public abstract readonly name: string;
  abstract execute(interaction: APIMessageComponentInteraction): Awaitable<APIInteractionResponseChannelMessageWithSource | APIInteractionResponseUpdateMessage>;
}