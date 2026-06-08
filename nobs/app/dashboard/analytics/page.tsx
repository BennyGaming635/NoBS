"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface ShortLink {
  id: string;
  code: string;
  url: string;
}

interface Visit {
  id: number;
  link_id: string;
  visited_at: string;
}

export default function AnalyticsPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        window.location.href = "/";
        return;
      }

      const { data: linksData } = await supabase
        .from("links")
        .select("id, code, url")
        .eq("user_id", user.id);

      const { data: visitsData } = await supabase
        .from("link_visits")
        .select("id, link_id, visited_at");

      setLinks(linksData || []);
      setVisits(visitsData || []);
      setLoading(false);
    };

    void loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h1>Loading analytics...</h1>
        </div>
      </div>
    );
  }

  const clickMap: Record<string, number> = {};

  for (const v of visits) {
    clickMap[v.link_id] = (clickMap[v.link_id] || 0) + 1;
  }

  const enrichedLinks = links.map((l) => ({
    ...l,
    clicks: clickMap[l.id] || 0,
  }));

  const totalLinks = links.length;

  const totalClicks = Object.values(clickMap).reduce(
    (a, b) => a + b,
    0
  );

  const topLink = enrichedLinks.reduce(
    (max, l) => (l.clicks > (max?.clicks || 0) ? l : max),
    enrichedLinks[0]
  );

  return (
    <div className="container">
      <div className="card wide">
        <div className="header">
          <h1 className="title">Analytics</h1>
          <Link href="/dashboard" className="button">
            Back
          </Link>
        </div>

        <div className="stats">
          <div className="stat">
            <h2>{totalLinks}</h2>
            <p>Total Links</p>
          </div>

          <div className="stat">
            <h2>{totalClicks}</h2>
            <p>Total Clicks</p>
          </div>

          <div className="stat">
            <h2>{topLink?.clicks || 0}</h2>
            <p>Top Link Clicks</p>
          </div>
        </div>

        <div className="section">
          <h2>Links</h2>

          {enrichedLinks.length === 0 && (
            <div className="result">No links yet.</div>
          )}

          {enrichedLinks.map((link) => (
            <div key={link.id} className="result">
              <strong>
                <a href={`/${link.code}`}>
                  bgbs.au/{link.code}
                </a>
              </strong>

              <div className="muted">{link.url}</div>

              <div>{link.clicks} clicks</div>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>Recent Visits</h2>

          {visits.length === 0 && (
            <div className="result">
              No visits recorded.
            </div>
          )}

          {visits
            .slice()
            .sort(
              (a, b) =>
                new Date(b.visited_at).getTime() -
                new Date(a.visited_at).getTime()
            )
            .slice(0, 50)
            .map((visit, i) => (
              <div key={i} className="result">
                {new Date(
                  visit.visited_at
                ).toLocaleString()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}