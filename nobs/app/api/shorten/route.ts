import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCode } from "../../lib/code";

async function codeExists(code: string) {
  const { data, error } = await supabaseAdmin
    .from("links")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (error) return false;

  return !!data;
}

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  let code = generateCode();

  for (let i = 0; i < 5; i++) {
    const exists = await codeExists(code);
    if (!exists) break;
    code = generateCode();
  }

  const { error } = await supabaseAdmin.from("links").insert({
    code,
    url,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    code,
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`,
  });
}