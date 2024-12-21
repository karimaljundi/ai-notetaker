'use server'
import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function doLogin(formData: FormData){
    const action = formData.get('action');
    if (action) {
        await signIn(action.toString(), { redirectTo: "/dashboard" });
    } else {
        console.error("Action is null"); 
    }

    console.log(action);

}
export async function doLogout(){
    await signOut({ redirectTo: "/" });
}