import { commandData } from "./CommandData";
import https from "node:https";
import dotenv from "dotenv";
import process from "node:process";
import util from "node:util";

const formatTxt = (format: [number, number], txt: string) =>  `\u001b[${format[0]}m${txt}\u001b[${format[1]}m`;
const colors = util.inspect.colors;

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server.  It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

dotenv.config({ path: ".dev.vars" });

const token = process.env["DISCORD_TOKEN"];
const applicationId = process.env["DISCORD_CLIENT_ID"];

if (!token) {
  throw new Error("The DISCORD_TOKEN environment variable is required.");
}
if (!applicationId) {
  throw new Error(
    "The DISCORD_APPLICATION_ID environment variable is required."
  );
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

const request = https.request(url, {
  method: "PUT",
  headers: {
    Authorization: `Bot ${token}`,
    "Content-Type": "application/json"
  }
});

request.write(JSON.stringify(commandData));
request.end();

console.log(formatTxt(colors["green"]!, "Request connected."));

request.on("response", (response) => {
  console.log(formatTxt(colors["blue"]!, "Request responded."));
  if (response.statusCode?.toString().startsWith("2")) {
    console.log(formatTxt(colors["green"]!, `${response.statusCode} ${response.statusMessage}`));
  } else {
    console.log(formatTxt(colors["red"]!, `${response.statusCode} ${response.statusMessage}`));
  }
  let data = "";
  response.on("data", (chunk) => {
    data += chunk;
  });
  response.on("end", () => {
    console.log(decodeURIComponent(data));
  });
});

request.on("error", (error) => {
  console.error(error);
});

request.on("close", () => {
  console.log(formatTxt(colors["blue"]!, "Request closed."));
});