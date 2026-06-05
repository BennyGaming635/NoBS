import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export async function POST(req: Request) {
  const { code, userId } = await req.json();

  if (!code || !userId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("links")
    .delete()
    .eq("code", code)
    .eq("user_id", userId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}