import {
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponseChannelMessageWithSource,
} from "discord-api-types/v10";
import { Awaitable } from "./UtilityTypes";

export abstract class Command {
  public abstract readonly name: string;
  abstract execute(
    interaction: APIChatInputApplicationCommandInteraction,
  ): Awaitable<APIInteractionResponseChannelMessageWithSource>;
}
