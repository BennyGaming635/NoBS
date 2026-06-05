import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCode } from "../../lib/code";

const UNLIMITED_USERS = new Set([
  "aba56af3-7687-43f0-ac78-84c09c9e0baf", // Ben
]);

export async function POST(req: Request) {
  const { url, userId } = await req.json();

  if (!url || !userId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const isUnlimited = UNLIMITED_USERS.has(userId);

  if (!isUnlimited) {
    const { count, error: countError } = await supabaseAdmin
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: 500 }
      );
    }

    if ((count || 0) >= 10) {
      return NextResponse.json(
        { error: "Limit reached (10 links)" },
        { status: 403 }
      );
    }
  }

  const code = generateCode();

  const { error } = await supabaseAdmin.from("links").insert({
    code,
    url,
    user_id: userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    code,
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`,
  });
}