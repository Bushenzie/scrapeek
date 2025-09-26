import { useEffect, useState } from "react";
import { authClient } from "@/lib/clients/auth";
import { isLogged } from "../utils/is-logged";

export const useSession = () => {
  const { data: session } = authClient.useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const logged = await isLogged();
      setIsLoggedIn(logged);
    })();
  }, []);

  return {
    isLogged: isLoggedIn,
    setIsLogged: setIsLoggedIn,
    ...session,
  };
};
