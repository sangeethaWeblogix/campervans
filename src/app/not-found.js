"use client";

// export const dynamic = "force-dynamic"
;
import Link from "next/link";
import "./not-found.css";
import Notfound from "./searchError";

export default function NotFoundPage() {
  const categories = [
    { name: "Off Road Campervans", slug: "off-road-category" },
    { name: "Hybrid Campervans", slug: "hybrid-category" },
    { name: "Pop Top Campervans", slug: "pop-top-category" },
    { name: "Luxury Campervans", slug: "luxury-category" },
    { name: "Family Campervans", slug: "family-category" },
    { name: "Touring Campervans", slug: "touring-category" },
  ];

  const states = [
    {
      name: "Australian Capital Territory",
      slug: "australian-capital-territory-state",
    },
    { name: "New South Wales", slug: "new-south-wales-state" },
    { name: "Northern Territory", slug: "northern-territory-state" },
    { name: "Queensland", slug: "queensland-state" },
    { name: "South Australia", slug: "south-australia-state" },
    { name: "Victoria", slug: "victoria-state" },
    { name: "Western Australia", slug: "western-australia-state" },
    { name: "Tasmania", slug: "tasmania-state" },
  ];

  return (
    <div className="page-wrap">
      <div className="card" role="main" aria-labelledby="page-title">
        <h1 id="page-title" className="err-number">
          404
        </h1>
        <p className="err-sub">
          Oops! The campervan or page you’re looking for isn’t available.
        </p>

        <div className="search-wrap">
          <form action="/search" method="get" role="search">
            <Notfound />
          </form>
        </div>

        <div className="actions">
          <Link className="btn btn-primary" href="/">
            Go to Homepage
          </Link>
          <Link className="btn btn-outline" href="/listings/">
            Browse Campervans
          </Link>
        </div>

        {/* ✅ Browse by Type & State Side by Side */}
        <div className="browse-grid">
          {/* Left: Category */}
          <div className="browse-column">
            <h4>Browse by Type:</h4>
            <ul>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/listings/${cat.slug}/`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: State */}
          <div className="browse-column">
            <h4>Browse by State:</h4>
            <ul>
              {states.map((state) => (
                <li key={state.slug}>
                  <Link href={`/listings/${state.slug}/`}>
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
