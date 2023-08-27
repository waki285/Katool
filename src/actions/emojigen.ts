import { Action, EmojiGenColors, EmojiGenFonts } from "@/interfaces";
import { APIInteractionResponseUpdateMessage, APIMessageComponentInteraction, ComponentType, InteractionResponseType } from "discord-api-types/v10";
import { isMessageComponentSelectMenuInteraction } from "discord-api-types/utils/v10";

export default class EmojiGen extends Action {
  name = "emojigen";
  async execute(interaction: APIMessageComponentInteraction): Promise<APIInteractionResponseUpdateMessage> {
    const customId = interaction.data.custom_id;
    if (isMessageComponentSelectMenuInteraction(interaction)) {
      if (!interaction.message.components) throw new Error("Message has no components");
      if (customId === "emojigen_font") {
        const chosenFont = interaction.data.values[0];
        const row1 = interaction.message.components[1];
        const row2 = interaction.message.components[2];
        // set chosenFont to default
        return {
          type: InteractionResponseType.UpdateMessage,
          data: {
            components: [
              {
                type: ComponentType.ActionRow,
                components: [{
                  type: ComponentType.StringSelect,
                  custom_id: "emojigen_font",
                  options: EmojiGenFonts.map(font => {
                    if (font.value === chosenFont) {
                      return {
                        ...font,
                        default: true
                      }
                    } else {
                      return {
                        ...font,
                        default: false
                      };
                    }
                  })
                }]
              },
              row1!,
              row2!
            ]
          }
        }
      } else if (customId === "emojigen_color") {
        const row0 = interaction.message.components[0];
        const row2 = interaction.message.components[2];
        const chosenColor = interaction.data.values[0];
        return {
          type: InteractionResponseType.UpdateMessage,
          data: {
            components: [
              row0!,
              {
                type: ComponentType.ActionRow,
                components: [{
                  type: ComponentType.StringSelect,
                  custom_id: "emojigen_color",
                  options: EmojiGenColors.map(color => {
                    if (color.value === chosenColor) {
                      return {
                        ...color,
                        default: true
                      }
                    } else {
                      return {
                        ...color,
                        default: false
                      };
                    }
                  })
                }]
              },
              row2!
            ]
          }
        }
      } else {
        throw new Error("Unknown custom_id");
      }
    } else {
      return {
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: "This is a test"
        }
      }
    }
  }
}