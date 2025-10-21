import { API_BASE } from "./api";

// 🧠 Define your shared Opportunity type here
export interface Opportunity {
  id: string;
  title: string;
  source: string;
  url?: string | null;
  category: string;
  date: string;
  summary?: string | null;
}

// 🧩 WebSocket payload shape
export interface MarketPayload {
  type: "new_opportunity";
  data: Opportunity;
}

export function openMarketSocket(onMessage: (payload: MarketPayload) => void) {
  const wsUrl = API_BASE.replace("http", "ws") + "/ws/market";
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => console.log("🔗 WS connected");
  socket.onclose = () => console.log("❌ WS disconnected");
  socket.onerror = (e) => console.error("⚠️ WS error", e);

  socket.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data) as MarketPayload;
      onMessage(payload);
    } catch {
      console.warn("Non-JSON message ignored");
    }
  };

  return socket;
}
