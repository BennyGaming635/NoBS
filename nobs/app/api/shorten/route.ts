import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCode } from "../../lib/code";
import { isUnlimitedUser } from "../../lib/unlimitedUsers";
import { isRickroll } from "../../lib/rickroll";
import { isBadDomain } from "../../lib/isBadDomain";

export async function POST(req: Request) {
  const { url, userId, privacy, password, alias } = await req.json();

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
  const aliasAllowed = isUnlimitedUser(cleanUserId);
  const cleanAlias = String(alias ?? "").trim();

  if (cleanAlias && !aliasAllowed) {
    return NextResponse.json(
      { error: "Custom aliases require unlimited access." },
      { status: 403 }
    );
  }

  const validAlias = /^[a-zA-Z0-9_-]+$/;

  if (cleanAlias && !validAlias.test(cleanAlias)) {
    return NextResponse.json({ error: "Invalid alias." }, { status: 400 });
  }

  const code = cleanAlias || generateCode();

  if (cleanAlias) {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("links")
      .select("id")
      .eq("code", cleanAlias)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { error: "Alias already taken." },
        { status: 409 }
      );
    }
  }

  if (!aliasAllowed) {
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