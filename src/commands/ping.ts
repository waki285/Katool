import { Command } from "@/interfaces";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { APIChatInputApplicationCommandInteraction, APIInteractionResponseChannelMessageWithSource } from "discord-api-types/v10";

export default class Ping extends Command {
  name = "ping";
  async execute(interaction: APIChatInputApplicationCommandInteraction): Promise<APIInteractionResponseChannelMessageWithSource> {
    return {
      type: 4,
      data: {
        content: `Pong! API Latency: ${BigInt(Date.now()) - DiscordSnowflake.deconstruct(interaction.id).timestamp}ms`,
      },
    };
  }
}