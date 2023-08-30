import { Action, EmojiGenColors } from "@/interfaces";
import {
  APIMessageComponentInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseUpdateMessage,
  InteractionType,
  APIModalSubmitInteraction,
  InteractionResponseType,
  ComponentType,
  MessageFlags,
} from "discord-api-types/v10";

export default class EmojiGenModal extends Action {
  name = "emojigenModal";
  async execute(
    interaction: APIMessageComponentInteraction | APIModalSubmitInteraction,
  ): Promise<
    | APIInteractionResponseUpdateMessage
    | APIInteractionResponseChannelMessageWithSource
  > {
    if (interaction.type !== InteractionType.ModalSubmit)
      throw new Error("Interaction is not a modal submit");
    if (!interaction.message?.components)
      throw new Error("Message has no components");
    const selected = interaction.data.components[0]?.components[0]?.value;
    const customId = interaction.data.custom_id;
    if (customId === "emojigenModal_enter") {
      if (!selected) throw new Error("No value selected");
      return {
        type: InteractionResponseType.UpdateMessage,
        data: {
          content: `Content: ${selected}\nUse the menu/buttons below to change settings, "Enter text" to enter text, and "Generate!" to generate.`,
        },
      };
    } else if (customId === "emojigenModal_color") {
      if (!selected) throw new Error("No value selected");
      if (!selected.toUpperCase().match(/^[0-9A-F]{6}([0-9A-F]{2})?$/)) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Invalid color: ${selected}`,
            flags: MessageFlags.Ephemeral,
          },
        };
      }
      return {
        type: InteractionResponseType.UpdateMessage,
        data: {
          components: [
            interaction.message.components[0]!,
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.StringSelect,
                  custom_id: "emojigen_color",
                  options: EmojiGenColors.map((x) => {
                    return {
                      ...x,
                      default: false,
                    };
                  }).concat({
                    label: `#${selected.toUpperCase()} (Custom)`,
                    value: selected.toUpperCase() + (selected.length === 6 ? "FF" : ""),
                    default: true,
                  }),
                },
              ],
            },
            interaction.message.components[2]!,
            interaction.message.components[3]!,
          ],
        },
      };
    } else {
      throw new Error("Invalid custom ID");
    }
  }
}
