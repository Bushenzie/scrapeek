import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/clients/auth"
import { apiKeyQueryKeys } from "./auth.keys"

export const useCreateApiKey = () =>
  useMutation({
    mutationFn: async (name: string) => {
      const response = await authClient.apiKey.create({
        name,
      })
      if (response.error) throw new Error("There was an error during creation of an API Key")
      const apiKey = await response.data?.key
      return apiKey
    },
    meta: {
      invalidatesQuery: apiKeyQueryKeys.lists(),
    },
  })

export const useDeleteApiKey = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const response = await authClient.apiKey.delete({
        keyId: id,
      })
      if (response.error) throw new Error("Something went wrong during deletion of an API key")
    },
    meta: {
      invalidatesQuery: apiKeyQueryKeys.lists(),
    },
  })

export const useUpdateApiKey = () =>
  useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await authClient.apiKey.update({
        keyId: id,
        name,
      })
      if (response.error) throw new Error("Something went wrong during update an API key")
    },
    meta: {
      invalidatesQuery: apiKeyQueryKeys.all,
    },
  })
