import { Hono } from "hono";
import { Env } from "./interfaces";
import Interactions from "./routes/interactions";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.text("Hello World!"));

app.route("/interactions", Interactions);

export default app;