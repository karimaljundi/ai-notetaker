import { doLogin } from "@/app/actions"
import { FaGoogle, FaApple } from "react-icons/fa";


 
export default function ProvidersForm() {
  return (
    <>
    <form action={doLogin}>
      
      <button type="submit" name="action" value="google"><FaGoogle className="text-black"/></button>
    </form>

  <form action={doLogin}>
  <button type="submit" name="action" value="apple"><FaApple className="text-black"/></button>
  </form>
  </>
  )

} 