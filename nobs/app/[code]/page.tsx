import { redirect } from "next/navigation";
import { supabaseAdmin } from "../lib/supabaseAdmin";

async function getUrl(code: string) {
  const { data, error } = await supabaseAdmin
    .from("links")
    .select("url")
    .eq("code", code)
    .single();

  if (error || !data) return null;
  return data.url;
}

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const url = await getUrl(code);
  if (!url) {
    return <div>Link not found</div>;
  }

  redirect(url);
}