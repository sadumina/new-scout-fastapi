from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import asyncio, json

from .models import Opportunity
from .fetchers import fetch_latest_opportunities

app = FastAPI(title="Scout Agent API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPPS: List[Opportunity] = []
SEEN: set[str] = set()

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, payload: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

manager = ConnectionManager()

@app.get("/api/opportunities", response_model=List[Opportunity])
async def list_opportunities(
    category: Optional[str] = Query(default="all"),
    daterange: Optional[str] = Query(default="all")
):
    now = datetime.utcnow()

    def in_range(o: Opportunity) -> bool:
        if daterange == "today":
            return o.date.date() == now.date()
        if daterange == "month":
            return (o.date.year == now.year) and (o.date.month == now.month)
        if daterange == "year":
            return o.date.year == now.year
        return True

    results = [o for o in OPPS if in_range(o)]
    if category and category != "all":
        results = [o for o in results if o.category == category]

    results.sort(key=lambda x: x.date, reverse=True)
    return results

@app.websocket("/ws/market")
async def market_ws(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)

async def poller():
    while True:
        try:
            latest = await fetch_latest_opportunities()
            new_items = []
            for opp in latest:
                if opp.id not in SEEN:
                    SEEN.add(opp.id)
                    OPPS.append(opp)
                    new_items.append(opp)
            if new_items:
                await manager.broadcast({
                    "type": "new_opportunity",  # ✅ match frontend
                    "data": new_items[0].model_dump()
                })
        except Exception as e:
            print("poller error:", e)
        await asyncio.sleep(10)

@app.on_event("startup")
async def on_startup():
    asyncio.create_task(poller())
