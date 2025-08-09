export async function apiFetch<T = any>(path: string, method = "GET", body?: unknown, token?: string): Promise<T> {
    const res = await fetch(`http://localhost:3000${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
  }
  