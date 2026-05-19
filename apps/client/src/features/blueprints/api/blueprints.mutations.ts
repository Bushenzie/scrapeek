import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/clients/hono"
import { unwrap } from "@/lib/unwrap"
import { blueprintQueryKeys } from "./blueprints.keys"
import type {
  CreateBlueprintRequest,
  DeleteBlueprintRequest,
  EditBlueprintRequest,
  RunBlueprintRequest,
  UpvoteBlueprintRequest,
} from "./blueprints.types"

export const useCreateBlueprint = () =>
  useMutation({
    mutationFn: (request: CreateBlueprintRequest) => client.api.blueprints.$post(request),
    meta: {
      invalidatesQuery: blueprintQueryKeys.list(),
      errorMessage: "There was an error during creation of blueprint",
      successMessage: "Successfully created blueprint",
    },
  })

export const useDeleteBlueprint = () =>
  useMutation({
    mutationFn: (request: DeleteBlueprintRequest) => client.api.blueprints[":id"].$delete(request),
    meta: {
      invalidatesQuery: blueprintQueryKeys.list(),
      errorMessage: "There was an error during deletion of blueprint",
      successMessage: "Successfully deleted blueprint",
    },
  })

export const useEditBlueprint = () =>
  useMutation({
    mutationFn: (request: EditBlueprintRequest) => client.api.blueprints[":id"].$patch(request),
    meta: {
      invalidatesQuery: blueprintQueryKeys.list(),
      errorMessage: "There was an error during update of blueprint",
      successMessage: "Successfully updated blueprint",
    },
  })

export const useRunBlueprint = () =>
  useMutation({
    mutationFn: (request: RunBlueprintRequest) => unwrap(client.api.runners.$post(request)),
    meta: {
      invalidatesQuery: blueprintQueryKeys.all,
      errorMessage: "There was an error the scraping of blueprint",
      mutateMessage: "Running blueprint",
      successMessage: "Successfully scraped blueprint",
    },
  })

export const useUpvoteBlueprint = () =>
  useMutation({
    mutationFn: (request: UpvoteBlueprintRequest) => client.api.upvotes.$post(request),
    meta: {
      invalidatesQuery: blueprintQueryKeys.all,
      errorMessage: "There was an error while upvoting a blueprint",
    },
  })
