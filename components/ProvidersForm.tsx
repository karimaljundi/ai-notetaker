import { Button } from "@/components/ui/button"
import { doLogin } from "@/app/actions"
import { FaGoogle, FaApple } from "react-icons/fa"

export default function ProvidersForm() {
  return (
    <div className="grid gap-4">
      <form action={doLogin}>
        <Button className="w-full" variant="outline" name="action" value="google">
          <FaGoogle className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </form>
      {/* <form action={doLogin}>
        <Button className="w-full" variant="outline" name="action" value="apple">
          <FaApple className="mr-2 h-4 w-4" />
          Sign in with Apple
        </Button>
      </form> */}
    </div>
  )
}