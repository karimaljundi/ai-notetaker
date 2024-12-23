'use server'
import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function doLogin(formData: FormData){
    const action = formData.get('action');
    if (action) {
        await signIn(action.toString(), { redirectTo: "/dashboard" });
        
    } else {
        console.error("Action is null"); 
    }

    console.log(action);
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
        console.log("Error:", error);
        return null;
    }
}
export const loginWithCreds = async (formData: FormData): Promise<void> => {
    const rawFormData = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      role: "ADMIN",
      redirectTo: "/dashboard",
    };
  
    const existingUser = await getUserByEmail(formData.get("email") as string);
    console.log(existingUser);
  
    try {
      await signIn("credentials", rawFormData);
    } catch (error: any) {
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
    revalidatePath("/");
  };