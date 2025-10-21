"use client";
import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { fetchOpportunities } from "../lib/api";
import { openMarketSocket } from "../lib/ws";

interface Opportunity {
  id: string;
  title: string;
  source: string;
  url?: string | null;
  category: string;
  date: string;
  summary?: string | null;
}

type DateRange = "all" | "today" | "month" | "year";

export default function Home() {
  const [category, setCategory] = useState("all");
  const [range, setRange] = useState<DateRange>("all");
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch from FastAPI backend
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchOpportunities({ category, daterange: range });
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load when filters change
  useEffect(() => {
    load();
  }, [category, range]);

  // 🛰️ Listen for WebSocket real-time updates
  useEffect(() => {
    const ws = openMarketSocket((payload) => {
      if (payload.type === "new_opportunity") {
        setItems((prev) => [payload.data, ...prev]);
      }
    });
    return () => ws && ws.close();
  }, []);

  const ranges = useMemo(
    () => [
      { key: "all", label: "All Time" },
      { key: "today", label: "Today" },
      { key: "month", label: "This Month" },
      { key: "year", label: "This Year" },
    ],
    []
  );

  const categories = [
    "all",
    "PFAS",
    "Soil Remediation",
    "Mining",
    "Gold Recovery",
    "Drinking Water",
    "Wastewater Treatment",
    "Air & Gas Purification",
    "Mercury Removal",
    "Food & Beverage",
    "Energy Storage",
    "Catalyst Support",
    "Automotive Filters",
    "Medical & Pharma",
    "Nuclear Applications",
    "EDLC",
    "Silicon Anodes",
    "Lithium Iron Batteries",
    "Carbon Block Filters",
    "Activated Carbon for Gold Recovery",
    "Activated Carbon for EDLC",
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.hero}>
        <div className={styles.heroIcon}>📈</div>
        <div>
          <h1 className={styles.title}>HAYCARB Market Scout</h1>
          <p className={styles.subtitle}>
            Real-time environmental & market intelligence
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Market Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Date Range</label>
          <div className={styles.rangeBtns}>
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key as DateRange)}
                className={range === r.key ? styles.activeBtn : ""}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={load}
          className={styles.refreshBtn}
          disabled={loading}
        >
          🔄 {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </section>

      {/* Opportunities */}
      <section>
        <h2 className={styles.sectionTitle}>Market Opportunities</h2>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : items.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          <div className={styles.cards}>
            {items.map((o) => (
              <div key={o.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.badge}>{o.category}</span>
                  <span className={styles.date}>
                    {new Date(o.date).toLocaleDateString()}
                  </span>
                </div>
                <h3>{o.title}</h3>
                {o.summary && <p>{o.summary}</p>}
                <div className={styles.cardFooter}>
                  <span>{o.source}</span>
                  {o.url && (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Details →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
