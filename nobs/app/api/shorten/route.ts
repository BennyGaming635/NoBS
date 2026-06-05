import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCode } from "../../lib/code";

export async function POST(req: Request) {
  const { url, userId } = await req.json();

  if (!url || !userId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const { count } = await supabaseAdmin
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((count || 0) >= 10) {
    return NextResponse.json(
      { error: "Limit reached (10 links)" },
      { status: 403 }
    );
  }

  const code = generateCode();

  await supabaseAdmin.from("links").insert({
    code,
    url,
    user_id: userId,
  });

  return NextResponse.json({
    code,
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`,
  });
}