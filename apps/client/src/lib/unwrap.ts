import type { ClientResponse } from "hono/client"

export const unwrap = async <T>(response: Promise<ClientResponse<T>>): Promise<T> => {
  const res = await response

  if (!res.ok) {
    console.error(res)
    throw new Error(`[${res.status}] Failed to fetch`)
  }

  return (await res.json()) as T
}
