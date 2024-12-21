import { doLogin, doLogout } from "@/app/actions"

 
export default function LoginForm() {
  return (
    <>
    <form action={doLogin}>
      <button type="submit" name="action" value="google">Signin with Google</button>
    </form>

  <form action={doLogin}>
  <button type="submit" name="action" value="apple">Signin with Apple</button>
  </form>
  </>
  )

} 