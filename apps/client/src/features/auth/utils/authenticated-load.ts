import { redirect } from "@tanstack/react-router";
import { isLogged } from "./is-logged";

type AuthenticatedRouteProps = {
  to: string;
};

export const authenticatedLoad = async (props: AuthenticatedRouteProps) => {
  const isLoggedIn = await isLogged();
  if (!isLoggedIn)
    throw redirect({
      to: props.to,
    });
};
