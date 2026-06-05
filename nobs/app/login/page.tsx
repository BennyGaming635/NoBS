"use client";

import { supabase } from "../lib/supabaseClient";

export default function Login() {
  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  }

  return (
    <div className="container">
      <button onClick={signIn}>Login with GitHub</button>
    </div>
  );
}