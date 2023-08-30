import { Hono } from "hono";
import { Env } from "./interfaces";
import Interactions from "./routes/interactions";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.text("Hello World!"));
app.get("/context", () => {
  const fd = new FormData();
  fd.append("text", "test");
  fd.append("file", new Blob(["test"], { type: "text/plain" }), "test.txt");
  return new Response(fd, { headers: { "Content-Type": "multipart/form-data" }});
});
app.route("/interactions", Interactions);


export default app;
