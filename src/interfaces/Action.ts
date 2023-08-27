import {
  APIMessageComponentInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseUpdateMessage,
  APIModalInteractionResponse,
  APIModalSubmitInteraction,
} from "discord-api-types/v10";
import { Awaitable } from "./UtilityTypes";

export abstract class Action {
  public abstract readonly name: string;
  abstract execute(
    interaction: APIMessageComponentInteraction | APIModalSubmitInteraction,
  ): Awaitable<
    | APIInteractionResponseChannelMessageWithSource
    | APIInteractionResponseUpdateMessage
    | APIModalInteractionResponse
  >;
}
