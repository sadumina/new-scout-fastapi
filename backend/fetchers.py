# backend/fetchers.py
from datetime import datetime, timedelta, timezone
from typing import List
from .models import Opportunity
import random

CATEGORIES = [
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
]

MOCK_SOURCES = [
    "Environmental News Network",
    "Global Industry Reports",
    "MarketWatch Insights",
    "Dairy Foods Magazine",
    "Mining Journal",
    "Medical Innovations Weekly",
]

def random_url(title: str) -> str:
    slug = title.lower().replace(" ", "-")
    return f"https://news.haycarb.com/{slug}"

async def fetch_latest_opportunities(category: str, daterange: str) -> List[Opportunity]:
    """Simulated market data generator."""

    now = datetime.now(timezone.utc)
    items = []

    for cat in CATEGORIES:
        for i in range(3):
            date_offset = random.randint(0, 365)
            fake_date = now - timedelta(days=date_offset)
            items.append(
                Opportunity(
                    title=f"{cat} Opportunity {i+1}",
                    source=random.choice(MOCK_SOURCES),
                    url=random_url(f"{cat} Opportunity {i+1}"),
                    category=cat,
                    date=fake_date,
                    summary=f"Market update for {cat}: potential growth detected in sector {i+1}.",
                )
            )

    # --- Category filter
    if category and category != "all":
        items = [item for item in items if item.category == category]

    # --- Daterange filter
    if daterange == "today":
        start = now.date()
        items = [item for item in items if item.date.date() == start]
    elif daterange == "month":
        start = now - timedelta(days=30)
        items = [item for item in items if item.date >= start]
    elif daterange == "year":
        start = now - timedelta(days=365)
        items = [item for item in items if item.date >= start]
    # else "all" → no filter

    items.sort(key=lambda x: x.date, reverse=True)
    return items
