import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

export const commandData: readonly RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "ping",
    description: "Ping the bot to see if it's alive.",
    description_localizations: {
      ja: "ボットが生きているかどうかを確認するためにボットにpingを送信します。"
    }
  },
  {
    name: "emoji_gen",
    description: "Generate an emoji with https://emoji-gen.ninja/",
    description_localizations: {
      ja: "https://emoji-gen.ninja/ を使って絵文字を生成します。"
    },
    
  }
] as const;