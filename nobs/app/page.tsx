import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">NoBS</h1>
        <p className="description">Login to mange your links</p>
        <br></br>
        <Link className="button" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}