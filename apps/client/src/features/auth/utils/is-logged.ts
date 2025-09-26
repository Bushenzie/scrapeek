import { authClient } from "@/lib/clients/auth";

export const isLogged = async () => {
  const { data: session } = await authClient.getSession();

  return session !== null;
};
