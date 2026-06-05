"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface Link {
  id: string;
  code: string;
  url: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      setUser(user);

      if (!user) return;

      const { data } = await supabase
        .from("links")
        .select("*")
        .order("created_at", { ascending: false });

      setLinks(data || []);
      setCount(data?.length || 0);
    })();
  }, []);

  if (!user) return <div>Not logged in</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <p>
        Links used: {count}/10
      </p>

      {count >= 10 && (
        <p style={{ color: "red" }}>
          Limit reached. Delete a link to create more.
        </p>
      )}

      <ul>
        {links.map((l) => (
          <li key={l.id}>
            <a href={`/${l.code}`}>{l.code}</a> → {l.url}
          </li>
        ))}
      </ul>
    </div>
  );
}