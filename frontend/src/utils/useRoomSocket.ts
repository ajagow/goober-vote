import { useState, useEffect, useRef, useCallback } from "react";
import type { RoomState } from "../types";
import { getVoterId } from "./getVoterId";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function useRoomSocket(roomId: string) {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const voterId = useRef(getVoterId());

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8000/ws/rooms/${roomId}?voter_id=${voterId.current}`
    );    
    
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");

    ws.onmessage = (event: MessageEvent<string>) => {
      const data: RoomState = JSON.parse(event.data);
      setRoomState(data);
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("disconnected");

    return () => {
      ws.close();
    };
  }, [roomId]);

  const mySelections = roomState ? new Set(roomState.my_selections) : new Set<string>();

  const vote = useCallback((option: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "vote", option }));
    }
  }, []);

  const addOption = useCallback((option: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "add-option", option }));
    }
  }, [])

  return { roomState, status, mySelections, vote, addOption};
}