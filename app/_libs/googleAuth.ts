import { supabase } from "./supabase";

export default async function handleGoogleSignIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/resumes`,
    },
  });
  if (error) {
    console.error(error);
  }
}
