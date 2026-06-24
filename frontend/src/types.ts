export type WinnerMethod = "random" | "top_vote" | "top_vote_random_tie_breaker";

export type RoomState = {
  type: "room_state";
  room_id: string;
  question: string;
  votes: Record<string, number>;
  my_selections: string[];
  voter_count: number;
  viewer_count: number;
  single_vote: boolean;
  is_closed: boolean;
  winning_options: string[];
  winner_method: WinnerMethod;
  chosen_winner?: string;
};

export type VoteMessage = {
  type: "vote";
  option: string;
};

export type AddOption = {
  type: "add-option";
  option: string;
};
