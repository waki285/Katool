import app from "../src/server";

describe("Hello World!", () => {
  test("GET /", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");
  });
});
