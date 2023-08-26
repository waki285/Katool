import { Env } from "@/interfaces";
import { getLogger } from "@/logger";
import { commands } from "@/managers";
import { verifyDiscordRequest } from "@/tools";
import {
  InteractionResponseType,
  InteractionType,
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
          data: { content: "Command not found." },
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
  }
});

export default router;
