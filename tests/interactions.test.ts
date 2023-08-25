import app from "../src/server";

describe("Interactions Handle", () => {
  test("POST /interactions with no signature", async () => {
    const req = new Request("http://localhost/interactions", {
      method: "POST",
    });
    const res = await app.request(req);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Invalid request signature" });
  });
});
