import { Command, EmojiGenColors, EmojiGenFonts } from "@/interfaces";
import {
  APIInteractionResponseChannelMessageWithSource,
  ButtonStyle,
  ComponentType,
} from "discord-api-types/v10";

export default class EmojiGen extends Command {
  name = "emoji_gen";
  async execute(/*interaction: APIChatInputApplicationCommandInteraction*/): Promise<APIInteractionResponseChannelMessageWithSource> {
    return {
      type: 4,
      data: {
        content: `Content: Unspecified\nUse the menu/buttons below to change settings, "Enter text" to enter text, and "Generate!" to generate.`,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.StringSelect,
                custom_id: "emojigen_font",
                options: EmojiGenFonts,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.StringSelect,
                custom_id: "emojigen_color",
                options: EmojiGenColors,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                custom_id: "emojigen_align_left",
                label: "Align left",
                style: ButtonStyle.Secondary,
              },
              {
                type: ComponentType.Button,
                custom_id: "emojigen_align_center",
                label: "Align center",
                style: ButtonStyle.Primary,
                disabled: true,
              },
              {
                type: ComponentType.Button,
                custom_id: "emojigen_align_right",
                label: "Align right",
                style: ButtonStyle.Secondary,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                custom_id: "emojigen_enter",
                label: "Enter text",
                style: ButtonStyle.Primary,
              },
              {
                type: ComponentType.Button,
                custom_id: "emojigen_generate",
                label: "Generate!",
                style: ButtonStyle.Success,
              },
              {
                type: ComponentType.Button,
                custom_id: "emojigen_create",
                label: "Create Emoji in Server",
                style: ButtonStyle.Success,
                disabled: true,
              },
            ],
          },
        ],
      },
    };
  }
}
