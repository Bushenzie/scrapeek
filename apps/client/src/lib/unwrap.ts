import type { ClientResponse } from "hono/client"

type APIResponse<T> = { data: T }

export const unwrap = async <T>(response: Promise<ClientResponse<APIResponse<T>>>): Promise<T> => {
  const res = await response

  if (!res.ok) {
    console.log(res)
    throw new Error(`[${res.status}] Failed to fetch`)
  }

  const { data } = (await res.json()) as APIResponse<T>

  return data
}
