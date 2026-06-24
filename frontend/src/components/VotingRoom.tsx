import { useRoomSocket } from "../utils/useRoomSocket";
import { useEffect, useRef, useState } from "react";
import { VoteCard } from "./VoteCard";
import styled from "@emotion/styled";
import { Input } from "./Input";
import { ACCENT, BLUE, Button, ErrorBanner, Pill, YELLOW } from "../contants";
import { useNavigate } from "react-router-dom";
import { CopyButton } from "./CopyButton";
import { useCloseRoom } from "../utils/useCloseRoom";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { WinnerCard } from "./WinnerCard";
import { useReopenRoom } from "../utils/useReopenRoom";
import { useChangeWinnerMethod } from "../utils/useChangeWinnerMethod";

type VotingRoomProps = {
  roomId: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PillWrapper = styled.div`
  width: max-content;
  align-self: center;
  display: flex;
  align-items: end;
  gap: 4px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
`;

const AddButton = styled(Button)`
  background: ${ACCENT};
  color: white;
`;

const VoteCount = styled.p`
  text-align: right;
  margin-top: 20px;
  color: lightgrey;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: max-content;
  margin: auto;
`;

const Header = styled.div`
  display: grid;
  align-items: self-start;
  grid-template-columns: auto max-content;
`;

export default function VotingRoom({ roomId }: VotingRoomProps) {
  const { roomState, status, vote, addOption, mySelections } = useRoomSocket(roomId);
  const [customOption, setCustomOption] = useState("");
  const [error, setError] = useState("");
  const { width, height } = useWindowSize();
  const { closeRoom, error: closeError } = useCloseRoom(roomId);
  const { reopenRoom, error: reopenError } = useReopenRoom(roomId);
  const { changeWinnerMethod, error: changeWinnerError } = useChangeWinnerMethod(roomId);
  const [recycleConfetti, setRecycleConfetti] = useState(false);

  const navigate = useNavigate();

  const isRoomClosed = roomState?.is_closed ?? false;
  const showTieBreaker =
    isRoomClosed &&
    ((roomState?.winner_method === "top_vote" && roomState?.winning_options.length > 1) ||
      roomState?.winner_method === "top_vote_random_tie_breaker");

  const showCloseVoting =
    !isRoomClosed && roomState?.votes && Object.values(roomState?.votes).some((val) => val !== 0);

  const wasClosedRef = useRef<boolean | null>(null); // null = "we don't know yet"

  useEffect(() => {
    if (!roomState) return; // haven't received real state yet, nothing to compare

    // First time we ever see real state — just record it, don't fire confetti
    if (wasClosedRef.current === null) {
      wasClosedRef.current = isRoomClosed;
      return;
    }

    if (!wasClosedRef.current && isRoomClosed) {
      setRecycleConfetti(true);
    }

    wasClosedRef.current = isRoomClosed;
  }, [isRoomClosed, roomState]);

  // clear confetti
  useEffect(() => {
    if (!recycleConfetti) return;

    const timer = setTimeout(() => {
      setRecycleConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [recycleConfetti]);

  useEffect(() => {
    setError("");
  }, [customOption]);

  if (status === "connecting") {
    return <p>Connecting to room...</p>;
  }

  if (status === "error" || status === "disconnected") {
    return <p>Connection lost. Try refreshing.</p>;
  }

  if (status === "notfound") {
    return (
      <NotFoundContainer>
        <p>sorry, room not found</p>
        <Button onClick={() => navigate("/")} backgroundColor={BLUE}>
          go back home
        </Button>
      </NotFoundContainer>
    );
  }

  if (!roomState) {
    return <p>Waiting for room data...</p>;
  }

  const totalVotes = Object.values(roomState.votes).reduce((a, b) => a + b, 0);

  const onSubmitCustomOption = () => {
    const trimmed = customOption.trim();

    if (!trimmed) {
      setError("You can't submit a blank entry!");
      return;
    }

    const isDuplicate = roomState?.votes
      ? Object.keys(roomState.votes).some(
          (option) => option.toLowerCase() === trimmed.toLowerCase()
        )
      : false;

    if (isDuplicate) {
      setError("That option already exists.");
      return;
    }

    addOption(trimmed);
    setCustomOption("");
  };
  return (
    <Container>
      {recycleConfetti && isRoomClosed && (
        <Confetti
          width={width}
          height={height}
          colors={[ACCENT, YELLOW, BLUE]}
          recycle={recycleConfetti}
          tweenDuration={500}
          initialVelocityY={25}
          numberOfPieces={300}
        />
      )}
      <Header>
        <h2>{roomState.question}</h2>
        <CopyButton />
      </Header>
      <WinnerCard roomState={roomState} />
      {showTieBreaker && (
        <PillWrapper>
          <Pill onClick={async () => await changeWinnerMethod("top_vote_random_tie_breaker")}>
            ⚄{" "}
            {roomState?.winner_method === "top_vote_random_tie_breaker"
              ? "re-roll"
              : "break the tie!"}
          </Pill>
          {roomState?.winner_method === "top_vote_random_tie_breaker" && (
            <Pill onClick={async () => await changeWinnerMethod("top_vote")}>
              ← undo tiebreaker
            </Pill>
          )}
        </PillWrapper>
      )}
      <OptionsContainer>
        {(error || closeError || reopenError || changeWinnerError) && (
          <ErrorBanner>{error ?? closeError ?? reopenError ?? changeWinnerError}</ErrorBanner>
        )}
        {Object.entries(roomState.votes).map(([option, count]) => {
          const percentage = count ? (count / totalVotes) * 100 : 0;
          return (
            <VoteCard
              key={option}
              onClick={() => vote(option)}
              title={option}
              percentage={percentage}
              voteCount={count}
              didVote={mySelections.has(option)}
              disabled={isRoomClosed}
            />
          );
        })}

        {!isRoomClosed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <Input
              label="custom option"
              type="text"
              placeholder="add your own option..."
              value={customOption}
              onChange={(e) => setCustomOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmitCustomOption();
                }
              }}
            />
            <AddButton onClick={onSubmitCustomOption}>add</AddButton>
          </div>
        )}
      </OptionsContainer>

      <PillWrapper>
        {!isRoomClosed && (
          <Pill onClick={async () => await closeRoom("random")}>
            ⚄ can't decide? leave it to lady luck!
          </Pill>
        )}
        {isRoomClosed && <Pill onClick={async () => await reopenRoom()}>↻ reopen voting</Pill>}
        {showCloseVoting && (
          <Pill backgroundColor={YELLOW} onClick={async () => await closeRoom("top_vote")}>
            ⚑ close voting
          </Pill>
        )}
      </PillWrapper>

      <VoteCount>
        <p>total votes: {totalVotes}</p>
        <p># of voters: {roomState.voter_count}</p>
        <p># of viewers: {roomState.viewer_count}</p>
      </VoteCount>
    </Container>
  );
}
