"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { isUnlimitedUser } from "../lib/unlimitedUsers";

interface Link {
  id: string;
  code: string;
  url: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    setUser(user);

    if (!user) return;

    const { data } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });

    setLinks(data || []);
  }

  async function createLink() {
    setError("");
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    if (!isUnlimitedUser(user.id) && links.length >= 10) {
      setError("Limit reached (10 links)");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed");
      setLoading(false);
      return;
    }

    setUrl("");
    await load();
    setLoading(false);
  }

    async function deleteLink(code: string) {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) return;

    await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        code,
        userId: user.id,
        }),
    });

    await load();
    }

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">NoBS</h1>
          <p className="subtitle">Not logged in</p>
          <Link href="/login">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Dashboard</h1>
        <p className="subtitle">
          Links: {links.length}
          {!isUnlimitedUser(user.id) ? "/10" : ""}
        </p>

        <div className="inputRow">
          <input
            className="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL..."
          />

          <button
            className="button"
            onClick={createLink}
            disabled={loading}
          >
            {loading ? "..." : "Shorten"}
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {links.map((l) => (
            <div key={l.id} className="result" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                <a href={`/${l.code}`}>{l.code}</a>
                <div style={{ fontSize: 12, color: "#888" }}>{l.url}</div>
                </div>

                <Image
                  src="/trash.png"
                  alt="delete"
                  width={18}
                  height={18}
                  onClick={() => deleteLink(l.code)}
                  style={{ cursor: "pointer", opacity: 0.7 }}
                />
            </div>
            ))}
      </div>
    </div>
  );
}