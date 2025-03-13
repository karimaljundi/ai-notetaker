'use server'
import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function doLogin(formData: FormData){
    const action = formData.get('action');
    if (action) {
        await signIn(action.toString(), { redirectTo: "/dashboard" });
        
    } else {
        console.error("Action is null"); 
    }

    // console.log(action);
    revalidatePath("/dashboard");

}
export async function doLogout(){
    await signOut({ redirectTo: "/" });
    revalidatePath("/");
}
const getUserByEmail = async (email : string)=>{
    try {
        const user = await db.user.findUnique({where: {email,},});
        return user;
    } catch (error) {
        // console.log("Error:", error);
        return null;
    }
}
export const loginWithCreds = async (formData: FormData): Promise<void> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  
  const existingUser = await getUserByEmail(email);
  // console.log(existingUser);

  try {
    // The correct way to use signIn in a server action
     signIn("credentials", { 
      email, 
      password,
      name,
      redirect: false // Important: don't auto-redirect in server action
    });
    
    // Handle redirect manually after successful authentication
    redirect("/dashboard");
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error("Invalid credentials");
          break; 
        default:
          console.error("Error:", error);
      }
    }

    throw error;
  }
};