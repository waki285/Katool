import { Env } from "@/interfaces";
import { verifyDiscordRequest } from "@/tools";
import { InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Env }>();

router.post("/", async (c) => {
  const { isValid, interaction } = await verifyDiscordRequest(c);
  if (!isValid) {
    c.status(401);
    return c.json({ error: "Invalid request signature" });
  }

  if (interaction.type === InteractionType.Ping) {
    return c.json({ type: InteractionResponseType.Pong });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Hello World!",
      },
    });
  }
})

export default router;