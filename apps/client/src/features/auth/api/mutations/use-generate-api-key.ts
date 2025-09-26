import { useMutation } from "@tanstack/react-query";
// import { axiosClient } from "@/lib/clients/axios";

export const useGenerateAPIKey = () => {
  return useMutation({
    mutationKey: ["generate-api-key"],
    mutationFn: async () => {
      try {
        alert("Not yet implemented");
      } catch {
        throw new Error("Failed to generate API Key");
      }
    },
  });
};
