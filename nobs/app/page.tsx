'use client';

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function shorten() {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/shorten", {
      method: "POST",
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data.shortUrl);
    setLoading(false);
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">noBS</h1>
        <p className="subtitle">Fast and free URL shortening.</p>
        <div className="inputRow">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL here"
            className="input"
          />

          <button onClick={shorten} disabled={loading} className="button">
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {result && (
          <div className="result">
            <span>Your link: </span>
            <a href={result} target="_blank">
              {result}
            </a>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #fff;
          padding: 20px;
          font-family: ui-sans-serif, system-ui;
          width: flex;
        }

        .card {
          width: 100%;
          max-width: 520px;
          background: #0a0a0a;
          border: 1px solid #1f1f1f;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 0 40px rgba(255, 255, 255, 0.03);
        }

        .title {
          font-size: 32px;
          margin: 0;
          letter-spacing: -1px;
        }

        .subtitle {
          color: #888;
          margin-top: 6px;
          margin-bottom: 20px;
        }

        .inputRow {
          display: flex;
          gap: 10px;
        }

        .input {
          flex: 1;
          background: #111;
          border: 1px solid #222;
          color: white;
          padding: 12px 14px;
          border-radius: 10px;
          outline: none;
        }

        .input:focus {
          border-color: #444;
        }

        .button {
          background: white;
          color: black;
          border: none;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result {
          margin-top: 18px;
          padding: 12px;
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 10px;
          font-size: 14px;
        }

        a {
          color: #fff;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}