import { Env } from "@/interfaces";
import { verifyKey } from "discord-interactions";
import { Context } from "hono";
import { APIInteraction } from "discord-api-types/v10";

export async function verifyDiscordRequest(
  ctx: Context<{ Bindings: Env }>,
): Promise<
  { isValid: true, interaction: APIInteraction } |
  { isValid: false, interaction: null }
> {
  const signature = ctx.req.header("X-Signature-Ed25519");
  const timestamp = ctx.req.header("X-Signature-Timestamp");
  const body = await ctx.req.text();

  if (!signature || !timestamp || !body) {
    return { isValid: false, interaction: null };
  }

  const isValid = verifyKey(
    body,
    signature,
    timestamp,
    ctx.env.DISCORD_PUBLIC_KEY
  );
  
  if (!isValid) {
    return { isValid: false, interaction: null };
  }
  
  return { isValid: true, interaction: JSON.parse(body) };
}