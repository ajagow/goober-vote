export type RoomState = {
  type: "room_state";
  room_id: string;
  question: string;
  votes: Record<string, number>;
  my_selections: string[];
  voter_count: number;
  viewer_count: number;
  single_vote: boolean;
  chosen_option: string;
  is_closed: boolean;
};

export type VoteMessage = {
  type: "vote";
  option: string;
};

export type AddOption = {
  type: "add-option";
  option: string;
};
