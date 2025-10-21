// frontend/components/OpportunityCard.tsx
"use client";

type Opportunity = {
  id: string;
  title: string;
  source: string;
  url?: string | null;
  category: string;
  date: string;   // ISO from backend
  summary?: string | null;
};

export default function OpportunityCard({ o }: { o: Opportunity }) {
  const d = new Date(o.date);
  return (
    <div className="rounded-2xl border p-4 mb-3 shadow-sm">
      <div className="text-xs opacity-70">{o.category}</div>
      <h3 className="font-semibold text-lg">{o.title}</h3>
      {o.summary ? <p className="text-sm mt-1">{o.summary}</p> : null}
      <div className="mt-2 text-sm flex gap-3 opacity-80">
        <span>Source: {o.source}</span>
        <span>{d.toLocaleString()}</span>
      </div>
      {o.url && (
        <a
          className="inline-block mt-2 text-blue-600 underline"
          href={o.url}
          target="_blank"
        >
          Open
        </a>
      )}
    </div>
  );
}
