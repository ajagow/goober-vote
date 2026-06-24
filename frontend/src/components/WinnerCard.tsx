import styled from "@emotion/styled";
import { Card, ACCENT } from "../contants";
import { RoomState } from "../types";

const FateCard = styled(Card)`
  background: ${ACCENT};
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
  cursor: unset;
`;

const getCardText = ({ roomState }: { roomState: RoomState }) => {
  const { winner_method, winning_options, chosen_winner } = roomState;
  if (winner_method === "random") {
    return {
      title: ["Fate has spoken!!", "Chance has picked:"],
      winner: chosen_winner,
    };
  } else if (winner_method === "top_vote") {
    const isMultiple = winning_options.length > 1;
    return {
      title: [
        "Drumroll please...",
        `The people have spoken! The ${isMultiple ? "winners are" : "winner is"}:`,
      ],
      winner: winning_options.join(" & "),
    };
  } else {
    return {
      title: ["The universe doesn't like ties!", "Fate has chosen:"],
      winner: chosen_winner,
      underTitle: `Contenders were ${winning_options.join(" & ")}`,
    };
  }
};

export const WinnerCard = ({ roomState }: { roomState: RoomState }) => {
  if (!roomState?.is_closed) {
    return null;
  }

  const { title, winner, underTitle } = getCardText({ roomState });

  return (
    <FateCard>
      <div>
        {title.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      <h1>{winner}</h1>
      {underTitle && <p>{underTitle}</p>}
    </FateCard>
  );
};
