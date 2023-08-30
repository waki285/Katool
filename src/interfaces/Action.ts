import {
  APIMessageComponentInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseUpdateMessage,
  APIModalInteractionResponse,
  APIModalSubmitInteraction,
  APIInteractionResponseDeferredMessageUpdate,
} from "discord-api-types/v10";
import { Awaitable } from "./UtilityTypes";
import { Env } from "./Env";

export abstract class Action {
  public abstract readonly name: string;
  abstract execute(
    interaction: APIMessageComponentInteraction | APIModalSubmitInteraction,
    env: Env,
  ): Awaitable<
    | APIInteractionResponseChannelMessageWithSource
    | APIInteractionResponseUpdateMessage
    | APIModalInteractionResponse
    | APIInteractionResponseDeferredMessageUpdate
  >;
}
