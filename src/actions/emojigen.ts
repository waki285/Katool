import { Action, EmojiGenColors, EmojiGenFonts, Env } from "@/interfaces";
import {
  APIInteractionResponseUpdateMessage,
  APIMessageComponentInteraction,
  ComponentType,
  InteractionResponseType,
  APIModalInteractionResponse,
  TextInputStyle,
  ButtonStyle,
  APIInteractionResponseChannelMessageWithSource,
  APIButtonComponentWithCustomId,
  APIStringSelectComponent,
  APIInteractionResponseDeferredMessageUpdate,
  Routes,
  RESTPatchAPIChannelMessageJSONBody,
  MessageFlags,
} from "discord-api-types/v10";
import {
  isMessageComponentButtonInteraction,
  isMessageComponentSelectMenuInteraction,
} from "discord-api-types/utils/v10";
import { DiscordManager } from "@/managers";
import { getLogger } from "@/logger";
import { Buffer } from "buffer";

const logger = getLogger("EmojiGen");

export default class EmojiGen extends Action {
  name = "emojigen";
  async execute(
    interaction: APIMessageComponentInteraction,
    env: Env,
  ): Promise<
    | APIInteractionResponseUpdateMessage
    | APIModalInteractionResponse
    | APIInteractionResponseChannelMessageWithSource
    | APIInteractionResponseDeferredMessageUpdate
  > {
    if (!interaction.message.components)
      throw new Error("Message has no components");
    const customId = interaction.data.custom_id;
    if (
      (interaction.member?.user.id || interaction.user?.id) !==
      interaction.message.interaction?.user.id
    ) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "You are not the user who created this message.",
          flags: MessageFlags.Ephemeral,
        },
      };
    }
    const discord = new DiscordManager(env.DISCORD_TOKEN);
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
                  components: [
                    {
                      type: ComponentType.TextInput,
                      custom_id: "color",
                      label: "Color",
                      placeholder:
                        "FF0000 (without alpha) or FF0000FF (with alpha)",
                      max_length: 8,
                      min_length: 6,
                      required: true,
                      style: TextInputStyle.Short,
                    },
                  ],
                },
              ],
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
                      style:
                        chosenAlign === "left"
                          ? ButtonStyle.Primary
                          : ButtonStyle.Secondary,
                      disabled: chosenAlign === "left",
                    },
                    {
                      type: ComponentType.Button,
                      custom_id: "emojigen_align_center",
                      label: "Align center",
                      style:
                        chosenAlign === "center"
                          ? ButtonStyle.Primary
                          : ButtonStyle.Secondary,
                      disabled: chosenAlign === "center",
                    },
                    {
                      type: ComponentType.Button,
                      custom_id: "emojigen_align_right",
                      label: "Align right",
                      style:
                        chosenAlign === "right"
                          ? ButtonStyle.Primary
                          : ButtonStyle.Secondary,
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
                  components: [
                    {
                      type: ComponentType.TextInput,
                      custom_id: "text",
                      label: "Text",
                      placeholder: "Emoji text.",
                      max_length: 25,
                      min_length: 1,
                      required: true,
                      style: TextInputStyle.Paragraph,
                    },
                  ],
                },
              ],
            },
          };
        } else if (customId === "emojigen_generate") {
          const content = interaction.message.content
            .replace(/^Content: /, "")
            .replace(
              /\nUse the menu\/buttons below to change settings, "Enter text" to enter text, and "Generate!" to generate\.$/,
              "",
            );
          if (!content || content === "Unspecified") {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "No text specified.",
                flags: 64,
              },
            };
          }
          const align = (
            interaction.message.components[2]?.components.find(
              (c) =>
                c.type === ComponentType.Button &&
                c.style === ButtonStyle.Primary,
            ) as APIButtonComponentWithCustomId
          ).custom_id.split("_")[2];
          const font = (
            interaction.message.components[0]
              ?.components[0] as APIStringSelectComponent
          ).options.find((o) => o.default)?.value;
          const color = (
            interaction.message.components[1]
              ?.components[0] as APIStringSelectComponent
          ).options.find((o) => o.default)?.value;
          const url = `https://emoji-gen.ninja/emoji?align=${align}&back_color=00000000&color=${color}&font=${font}&locale=ja&public_fg=false&size_fixed=false&stretch=true&text=${encodeURIComponent(
            content,
          )}`;
          const response = await fetch(url);
          const fd = new FormData();
          fd.append("files[0]", await response.blob(), "emoji.png");
          const payload: RESTPatchAPIChannelMessageJSONBody = {
            components: [
              interaction.message.components[0]!,
              interaction.message.components[1]!,
              interaction.message.components[2]!,
              {
                type: ComponentType.ActionRow,
                components: [
                  interaction.message.components[3]!.components[0]!,
                  interaction.message.components[3]!.components[1]!,
                  {
                    type: ComponentType.Button,
                    custom_id: "emojigen_create",
                    label: "Create Emoji in Server",
                    disabled: interaction.guild_id === null,
                    style: ButtonStyle.Success,
                  },
                ],
              },
            ],
            attachments: [
              {
                id: "0",
                filename: "emoji.png",
              },
            ],
          };
          fd.append("payload_json", JSON.stringify(payload));
          const data = await fetch(
            "https://discord.com/api/v10" +
              Routes.channelMessage(
                interaction.channel.id,
                interaction.message.id,
              ),
            {
              method: "PATCH",
              headers: {
                Authorization: `Bot ${env.DISCORD_TOKEN}`,
              },
              body: fd,
            },
          );
          logger.debug(data);
          return {
            type: InteractionResponseType.DeferredMessageUpdate,
          };
        } else if (customId === "emojigen_create") {
          const rawAttachmentUrl = interaction.message.attachments[0]?.url;
          if (!rawAttachmentUrl) {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "No attachment found.",
                flags: 64,
              },
            };
          }
          const attachmentUrl = `https://discord-cdn-proxy.cyclic.app/${interaction.channel.id}/${interaction.message.attachments[0]?.id}/${interaction.message.attachments[0]?.filename}`;
          if (!interaction.guild_id) {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: "You must be in a server to create an emoji.",
                flags: 64,
              },
            };
          }
          const emojiResponse = await fetch(attachmentUrl);
          logger.debug(attachmentUrl);
          const blob = await emojiResponse.blob();

          // get data url without filereader
          const emojiDataUrl = `data:image/png;base64,${Buffer.from(
            await blob.arrayBuffer(),
          ).toString("base64")}`;
          logger.debug(emojiDataUrl);
          // create emoji
          try {
            const emoji = await discord.post(
              Routes.guildEmojis(interaction.guild_id),
              {
                name: String(new Date().getTime()),
                image: emojiDataUrl,
              },
            );
            logger.debug(emoji);
            if (emoji.message && emoji.code) {
              return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                  content: `Error: ${emoji.message} (${emoji.code})`,
                  flags: 64,
                },
              };
            }
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: `Emoji created: <:${emoji.name}:${emoji.id}>`,
                flags: 64,
              },
            };
          } catch (e: unknown) {
            logger.error(e);
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: `Error: ${e}`,
                flags: 64,
              },
            };
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
