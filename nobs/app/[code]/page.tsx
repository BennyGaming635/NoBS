import { redirect } from "next/navigation";
import { supabaseAdmin } from "../lib/supabaseAdmin";

async function getLink(code: string) {
  const { data, error } = await supabaseAdmin
    .from("links")
    .select("url, is_rickroll")
    .eq("code", code)
    .single();

  if (error || !data) return null;

  return data;
}

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const link = await getLink(code);

  if (!link) {
    return <div>Link not found</div>;
  }

  if (link.is_rickroll) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">Rickroll Warning</h1>
          <p className="subtitle">
            This destination appears to be a known Rickroll.
          </p>

          <a
            className="button"
            href={link.url}
          >
            Continue Anyway
          </a>
        </div>
      </div>
    );
  }

  redirect(link.url);
}