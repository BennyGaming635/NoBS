import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCode } from "../../lib/code";
import { isUnlimitedUser } from "../../lib/unlimitedUsers";
import { isRickroll } from "../../lib/rickroll";
import { isBadDomain } from "../../lib/isBadDomain";

export async function POST(req: Request) {
  const { url, userId, privacy, password } = await req.json();

  if (!url || !userId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  if (privacy === "password" && (!password || password.trim() === "")) {
    return NextResponse.json(
      { error: "Password required" },
      { status: 400 }
    );
  }

  const cleanUserId = String(userId ?? "").trim();
  const unlimitedUser = isUnlimitedUser(cleanUserId);

  if (!unlimitedUser) {
    const { count, error } = await supabaseAdmin
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", cleanUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if ((count ?? 0) >= 10) {
      return NextResponse.json(
        { error: "Limit reached (10 links)" },
        { status: 403 }
      );
    }
  }

  const code = generateCode();
  const rickroll = isRickroll(url);
  const badDomain = isBadDomain(url);

  const { error } = await supabaseAdmin.from("links").insert({
    code,
    url,
    user_id: cleanUserId,
    is_rickroll: rickroll,
    is_bad_domain: badDomain,
    privacy: privacy ?? "public",
    password: privacy === "password" ? password : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    code,
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`,
    isRickroll: rickroll,
    isBadDomain: badDomain,
  });
}