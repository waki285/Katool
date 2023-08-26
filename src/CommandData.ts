import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

export const commandData: readonly RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "ping",
    description: "Ping the bot to see if it's alive.",
    description_localizations: {
      ja: "ボットが生きているかどうかを確認するためにボットにpingを送信します。"
    }
  }
] as const;