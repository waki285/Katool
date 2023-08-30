export class DiscordManager {
  #root = "https://discord.com/api/v10";
  #token;
  constructor(token: string) {
    this.#token = token;
  }
  async get(url: string) {
    const r = await fetch(`${this.#root}${url}`, {
      headers: {
        Authorization: `Bot ${this.#token}`,
      },
    });
    return await r.json();
  }
  async post<T>(url: string, body: T) {
    const r = await fetch(`${this.#root}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bot ${this.#token}`,
        "Content-Type": "application/json",
      } as HeadersInit,
    });
    return await r.json();
  }
  async patch<T>(url: string, body: T) {
    const r = await fetch(`${this.#root}${url}`, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: {
        Authorization: `Bot ${this.#token}`,
        'Accept': '*/*',
        "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
      } as HeadersInit,
    });
    return await r.json();
  }
  async delete<T>(url: string, body: T) {
    const r = await fetch(`${this.#root}${url}`, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bot ${this.#token}`,
        "Content-Type": "application/json",
      },
    });
    return await r.json();
  }
  async put<T>(url: string, body: T) {
    const r = await fetch(`${this.#root}${url}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bot ${this.#token}`,
        "Content-Type": "application/json",
      },
    });
    return await r.json();
  }
}