import { Action, EmojiGenColors, EmojiGenFonts } from "@/interfaces";
import {
  APIInteractionResponseUpdateMessage,
  APIMessageComponentInteraction,
  ComponentType,
  InteractionResponseType,
  APIModalInteractionResponse,
  TextInputStyle,
  ButtonStyle,
  APIInteractionResponseChannelMessageWithSource,
  APIButtonComponentWithCustomId
} from "discord-api-types/v10";
import { isMessageComponentButtonInteraction, isMessageComponentSelectMenuInteraction } from "discord-api-types/utils/v10";

export default class EmojiGen extends Action {
  name = "emojigen";
  async execute(
    interaction: APIMessageComponentInteraction,
  ): Promise<APIInteractionResponseUpdateMessage | APIModalInteractionResponse | APIInteractionResponseChannelMessageWithSource> {
    if (!interaction.message.components)
      throw new Error("Message has no components");
    const customId = interaction.data.custom_id;
    if (isMessageComponentSelectMenuInteraction(interaction)) {
      if (customId === "emojigen_font") {
        const chosenFont = interaction.data.values[0];
        const row1 = interaction.message.components[1];
        const row2 = interaction.message.components[2];
        const row3 = interaction.message.components[3];
        // set chosenFont to default
        return {
          type: InteractionResponseType.UpdateMessage,
          data: {
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.StringSelect,
                    custom_id: "emojigen_font",
                    options: EmojiGenFonts.map((font) => {
                      if (font.value === chosenFont) {
                        return {
                          ...font,
                          default: true,
                        };
                      } else {
                        return {
                          ...font,
                          default: false,
                        };
                      }
                    }),
                  },
                ],
              },
              row1!,
              row2!,
              row3!,
            ],
          },
        };
      } else if (customId === "emojigen_color") {
        const row0 = interaction.message.components[0];
        const row2 = interaction.message.components[2];
        const row3 = interaction.message.components[3];
        const chosenColor = interaction.data.values[0];
        if (chosenColor === "custom") {
          return {
            type: InteractionResponseType.Modal,
            data: {
              custom_id: "emojigenModal_color",
              title: "Custom color",
              components: [
                {
                  type: ComponentType.ActionRow,
                  components: [{
                    type: ComponentType.TextInput,
                    custom_id: "color",
                    label: "Color",
                    placeholder: "FF0000 (without alpha) or FF0000FF (with alpha)",
                    max_length: 8,
                    min_length: 6,
                    required: true,
                    style: TextInputStyle.Short,
                  }]
                }
              ]
            },
          };
        }
        return {
          type: InteractionResponseType.UpdateMessage,
          data: {
            components: [
              row0!,
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.StringSelect,
                    custom_id: "emojigen_color",
                    options: EmojiGenColors.map((color) => {
                      if (color.value === chosenColor) {
                        return {
                          ...color,
                          default: true,
                        };
                      } else {
                        return {
                          ...color,
                          default: false,
                        };
                      }
                    }),
                  },
                ],
              },
              row2!,
              row3!,
            ],
          },
        };
      } else {
        throw new Error("Unknown custom_id");
      }
    } else {
      if (isMessageComponentButtonInteraction(interaction)) {
        if (customId.startsWith("emojigen_align")) {
          const row0 = interaction.message.components[0];
          const row1 = interaction.message.components[1];
          const row3 = interaction.message.components[3];
          const chosenAlign = customId.split("_")[2];
          return {
            type: InteractionResponseType.UpdateMessage,
            data: {
              components: [
                row0!,
                row1!,
                {
                  type: ComponentType.ActionRow,
                  components: [
                    {
                      type: ComponentType.Button,
                      custom_id: "emojigen_align_left",
                      label: "Align left",
                      style: chosenAlign === "left" ? ButtonStyle.Primary : ButtonStyle.Secondary,
                      disabled: chosenAlign === "left",
                    },
                    {
                      type: ComponentType.Button,
                      custom_id: "emojigen_align_center",
                      label: "Align center",
                      style: chosenAlign === "center" ? ButtonStyle.Primary : ButtonStyle.Secondary,
                      disabled: chosenAlign === "center",
                    },
                    {
                      type: ComponentType.Button,
                      custom_id: "emojigen_align_right",
                      label: "Align right",
                      style: chosenAlign === "right" ? ButtonStyle.Primary : ButtonStyle.Secondary,
                      disabled: chosenAlign === "right",
                    },
                  ],
                },
                row3!,
              ],
            },
          };
        } else if (customId === "emojigen_enter") {
          return {
            type: InteractionResponseType.Modal,
            data: {
              custom_id: "emojigenModal_enter",
              title: "Enter text",
              components: [
                {
                  type: ComponentType.ActionRow,
                  components: [{
                    type: ComponentType.TextInput,
                    custom_id: "text",
                    label: "Text",
                    placeholder: "Emoji text.",
                    max_length: 25,
                    min_length: 1,
                    required: true,
                    style: TextInputStyle.Paragraph
                  }]
                }
              ]
            },
          }
        } else if (customId === "emojigen_generate") {
          const content = interaction.message.content.replace(/^Content: /, "").replace(/\nUse the menu\/buttons below to change settings, "Enter text" to enter text, and "Generate!" to generate\.$/, "");
          if (!content || content === "Unspecified") {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "No text specified.",
                flags: 64,
              },
            };
          }
          const align = (interaction.message.components[2]?.components[0] as APIButtonComponentWithCustomId).custom_id.split("_")[2];
          const font = (interaction.message.components[0]?.components[0] as APIButtonComponentWithCustomId).custom_id;
          const color = (interaction.message.components[1]?.components[0] as APIButtonComponentWithCustomId).custom_id;
          const url = `
          https://emoji-gen.ninja/emoji?align=${align}&back_color=00000000&color=${color}&font=${font}&locale=ja&public_fg=false&size_fixed=false&stretch=true&text=${encodeURIComponent(content)}}`;
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          return {
            type: InteractionResponseType.UpdateMessage,
            data: {
              attachments: [{
                filename: "emoji.png",
                
                content: buffer,
              }],
            }
          }
        } else {
          throw new Error("Unknown custom_id");
        }
      } else {
        throw new Error("Unknown interaction type");
      }
    }
  }
}
