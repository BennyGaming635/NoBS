"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  async function shorten() {
    const res = await fetch("/api/shorten", {
      method: "POST",
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data.shortUrl);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>NoBS</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste URL"
        style={{ width: 300 }}
      />

      <button onClick={shorten}>Shorten</button>
      {result && <p>{result}</p>}
    </div>
  );
}