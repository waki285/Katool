import { Command } from "@/interfaces";
import { APIInteractionResponseChannelMessageWithSource, APISelectMenuOption, ButtonStyle, ComponentType } from "discord-api-types/v10";

const fonts: APISelectMenuOption[] = [
  {
    label: "Noto Sans Mono CJK JP Bold",
    value: "notosans-mono-bold",
    default: true
  },
  {
    label: "M+ 1p black",
    value: "mplus-1p-black",
  },
  {
    label: "Rounded M+ 1p black",
    value: "rounded-x-mplus-1p-black",
  },
  {
    label: "IPAmj Mincho",
    value: "ipamjm",
  },
  {
    label: "Aoyagi Reisyo Shimo",
    value: "aoyagireishoshimo",
  },
  {
    label: "LinLibertine Bold",
    value: "LinLibertine_RBah",
  }
]

const colors: APISelectMenuOption[] = [
  {
    label: "#EC71A1",
    value: "EC71A1FF",
    default: true,
  },
  {
    label: "#3AB0C7",
    value: "3AB0C7FF",
  },
  {
    label: "#38BA91",
    value: "38BA91FF",
  },
  {
    label: "#EAA82A",
    value: "EAA82AFF",
  },
  {
    label: "#1111FF",
    value: "1111FFFF",
  },
  {
    label: "#00BB00",
    value: "00BB00FF",
  },
  {
    label: "#FF0000",
    value: "FF0000FF",
  },
  {
    label: "#000000",
    value: "000000FF",
  },
  {
    label: "#FFFFFF",
    value: "FFFFFFFF",
  },
  {
    label: "Custom",
    value: "custom",
  }
]

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
            components: [{
              type: ComponentType.StringSelect,
              custom_id: "emojigen_font",
              options: fonts,
            }]
          },
          {
            type: ComponentType.ActionRow,
            components: [{
              type: ComponentType.StringSelect,
              custom_id: "emojigen_color",
              options: colors,
            }]
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
              }
            ]
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
              }
            ]
          }
        ]
      },
    };
  }
}