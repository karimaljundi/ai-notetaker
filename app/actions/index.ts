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
        return null;
    }
}

export const loginWithCreds = async (formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: "ADMIN",
  };

  try {
    // Remove redirect options to avoid the CallbackRouteError
    await signIn("credentials", rawFormData);
    
    // Instead manually redirect after successful authentication
    redirect("/dashboard");
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new Error("Invalid credentials");
        default:
          throw error;
      }
    }
    throw error;
  }
}