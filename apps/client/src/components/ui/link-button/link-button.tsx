import { createLink, type LinkComponent } from "@tanstack/react-router"
import { Button } from "../button/button"

const LinkButtonComponent = createLink(Button)

export const LinkButton: LinkComponent<typeof Button> = (props) => {
  return <LinkButtonComponent {...props} />
}
