import { Env } from "@/interfaces";
import { getLogger } from "@/logger";
import { actions, commands } from "@/managers";
import { verifyDiscordRequest } from "@/tools";
import {
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10";
import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Env }>();

const logger = getLogger("Interactions");

router.post("/", async (c) => {
  const { isValid, interaction } = await verifyDiscordRequest(c);
  if (!isValid) {
    c.status(401);
    return c.json({ error: "Invalid request signature" });
  }

  logger.info(`Received interaction`);

  if (interaction.type === InteractionType.Ping) {
    logger.info(`Received ping`);
    return c.json({ type: InteractionResponseType.Pong });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    if (isChatInputApplicationCommandInteraction(interaction)) {
      const command = commands.get(interaction.data.name);
      if (!command) {
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: "Command not found.",
            flags: MessageFlags.Ephemeral,
          },
        });
      }
      logger.info(`Received command ${command.name}. Executing`);
      const response = await command.execute(interaction);
      logger.info(`Command ${command.name} executed`);
      return c.json(response);
    } else {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: "This command is not supported." },
      });
    }
  } else if (
    interaction.type === InteractionType.MessageComponent ||
    interaction.type === InteractionType.ModalSubmit
  ) {
    logger.info(`Received message component`);
    const customId = interaction.data.custom_id;
    logger.info(customId);
    let action = actions.get(customId);
    action ??= actions
      .filter((a) => customId.startsWith(a.name))
      .sort((a, b) => b.name.length - a.name.length)
      .first();
    if (!action) {
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: "Action not found.", flags: MessageFlags.Ephemeral },
      });
    }

    logger.info(`Received action ${action.name}. Executing`);
    try {
      const response = await action.execute(interaction, c.env);
      logger.info(`Action ${action.name} executed`);
      return c.json(response);
    } catch (e) {
      logger.error(`Action ${action.name} errored`);
      logger.error(e);
      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: "An error occurred.", flags: MessageFlags.Ephemeral },
      });
    }
  }
});

export default router;
