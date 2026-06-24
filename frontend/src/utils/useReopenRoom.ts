import { useCallback, useState } from "react";
import { API_URL } from "../contants";

export const useReopenRoom = (roomId: string | undefined) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const reopenRoom = useCallback(async () => {
    if (!roomId) {
      setError("No room specified");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/reopen`, { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setError("Please try again.");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  return {
    reopenRoom,
    error,
    loading,
  };
};
