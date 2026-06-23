import { useCallback, useState } from "react";
import { API_URL } from "../contants";

export const useToggleRoom = (roomId: string | undefined) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const toggleRoom = useCallback(async () => {
    if (!roomId) {
      setError("No room specified.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/toggle-room`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Try again.");
      }
      // No setResponse here — the WebSocket broadcast will update roomState
      // in useRoomSocket, which is what the UI should actually render from.
    } catch {
      setError("Please try again.");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  return { error, loading, toggleRoom };
};