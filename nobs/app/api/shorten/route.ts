import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCode } from "../../lib/code";

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  const code = generateCode();

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