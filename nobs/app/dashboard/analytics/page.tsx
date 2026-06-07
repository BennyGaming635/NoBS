"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface ShortLink {
  id: string;
  code: string;
  url: string;
  clicks: number;
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
    let isMounted = true;

    const loadAnalytics = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        window.location.href = "/";
        return;
      }

      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("clicks", { ascending: false });

      const { data: visitsData } = await supabase
        .from("link_visits")
        .select("*")
        .order("visited_at", { ascending: false })
        .limit(100);

      if (!isMounted) return;

      setLinks(linksData || []);
      setVisits(visitsData || []);
      setLoading(false);
    };

    void loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalLinks = links.length;

  const totalClicks = links.reduce(
    (sum, link) => sum + (link.clicks || 0),
    0
  );

  const topLink =
    links.length > 0
      ? links.reduce((a, b) =>
          (a.clicks || 0) > (b.clicks || 0) ? a : b
        )
      : null;

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h1>Loading analytics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card wide">
        <div className="header">
          <h1 className="title">Analytics</h1>
          <br></br>
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

        {topLink && (
          <div className="section">
            <h2>Most Clicked Link</h2>

            <div className="result">
              <strong>
                <a href={`/${topLink.code}`}>
                  bgbs.au/{topLink.code}
                </a>
              </strong>

              <div>{topLink.url}</div>

              <div>{topLink.clicks} clicks</div>
            </div>
          </div>
        )}

        <div className="section">
          <h2>Links</h2>

          {links.length === 0 && (
            <div className="result">
              No links yet.
            </div>
          )}

          {links.map((link) => (
            <div key={link.id} className="result">
              <div>
                <strong>
                  <a href={`/${link.code}`}>
                    bgbs.au/{link.code}
                  </a>
                </strong>
              </div>

              <div className="muted">{link.url}</div>

              <div>{link.clicks || 0} clicks</div>
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

          {visits.map((visit) => (
            <div key={visit.id} className="result">
              {new Date(
                visit.visited_at
              ).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .stat {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 16px;
        }

        .stat h2 {
          margin: 0;
          font-size: 28px;
        }

        .stat p {
          margin: 6px 0 0;
          color: #888;
        }
      `}</style>
    </div>
  );
}