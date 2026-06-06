import { redirect } from "next/navigation";
import { supabaseAdmin } from "../lib/supabaseAdmin";

async function getLink(code: string) {
  const { data, error } = await supabaseAdmin
    .from("links")
    .select("url, is_rickroll, is_bad_domain, privacy, password")
    .eq("code", code)
    .single();

  if (error || !data) return null;

  return data;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams?: Promise<{ password?: string }>;
}) {
  const { code } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const submittedPassword = resolvedSearchParams?.password ?? "";
  const link = await getLink(code);

  if (!link) {
    return <div>Link not found</div>;
  }

  if (link.privacy === "password") {
    if (!submittedPassword) {
      return (
        <div className="container">
          <div className="card">
            <h1 className="title">Password Required</h1>
            <p className="subtitle">
              This link is protected. Enter the password to continue.
            </p>
            <form method="get">
              <input
                className="input"
                name="password"
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button className="button" type="submit">
                Continue
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (submittedPassword !== link.password) {
      return (
        <div className="container">
          <div className="card">
            <h1 className="title">Password Required</h1>
            <p className="subtitle">That password was incorrect. Try again.</p>
            <form method="get">
              <input
                className="input"
                name="password"
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button className="button" type="submit">
                Continue
              </button>
            </form>
          </div>
        </div>
      );
    }
  }

  if (link.is_bad_domain || link.is_rickroll) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">
            {link.is_bad_domain ? "Unsafe Link Warning" : "Rickroll Warning"}
          </h1>
          {link.is_bad_domain ? (
            <p className="subtitle">
              This destination matches a known unsafe or suspicious domain.
            </p>
          ) : null}
          {link.is_rickroll ? (
            <p className="subtitle">
              This destination appears to be a known Rickroll.
            </p>
          ) : null}
          <br></br>
          <a className="button" href={link.url}>
            Continue Anyway
          </a>
        </div>
      </div>
    );
  }

  redirect(link.url);
}