import { useCallback, useState } from "react";
import { API_URL } from "../contants";
import { WinnerMethod } from "../types";

export const useChangeWinnerMethod = (roomId: string | undefined) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const changeWinnerMethod = useCallback(
    async (winnerMethod: WinnerMethod) => {
      if (!roomId) {
        setError("No room specified");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/rooms/${roomId}/method`, {
          method: "POST",
          body: JSON.stringify({ method: winnerMethod }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error ?? "Something went wrong. Try again.");
        }
      } catch {
        setError("Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [roomId]
  );

  return {
    changeWinnerMethod,
    error,
    loading,
  };
};
