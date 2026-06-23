import { useRoomSocket } from "../utils/useRoomSocket";
import { useEffect, useRef, useState } from "react";
import { VoteCard } from "./VoteCard";
import styled from "@emotion/styled";
import { Input } from "./Input";
import { ACCENT, BLUE, Button, Card, ErrorBanner, Pill, YELLOW } from "../contants";
import { useNavigate } from "react-router-dom";
import { CopyButton } from "./CopyButton";
import { useToggleRoom } from "../utils/useToggleRoom";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

type VotingRoomProps = {
  roomId: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VotingWrapper = styled.div`
  width: max-content;
  align-self: self-end;
  display: flex;
  align-items: end;
  flex-direction: column;
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

const FateCard = styled(Card)`
  background: ${ACCENT};
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export default function VotingRoom({ roomId }: VotingRoomProps) {
  const { roomState, status, vote, addOption, mySelections } = useRoomSocket(roomId);
  const [customOption, setCustomOption] = useState("");
  const [error, setError] = useState("");
  const { width, height } = useWindowSize();
  const { toggleRoom, error: toggleError } = useToggleRoom(roomId);
  const [recycleConfetti, setRecycleConfetti] = useState(false);

  const navigate = useNavigate();

  const isRoomClosed = roomState?.is_closed ?? false;

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
      {isRoomClosed && (
        <FateCard>
          <p>Fate has spoken!! Chance has picked:</p>
          <h1>{roomState?.chosen_option}</h1>
        </FateCard>
      )}
      <OptionsContainer>
        {(error || toggleError) && <ErrorBanner>{error || toggleError}</ErrorBanner>}
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

      <VotingWrapper>
        <Pill onClick={async () => await toggleRoom()}>
          {isRoomClosed ? "↻ reopen voting" : "⚄ can't decide? leave it to lady luck!"}
        </Pill>
      </VotingWrapper>

      <VoteCount>
        <p>total votes: {totalVotes}</p>
        <p># of voters: {roomState.voter_count}</p>
        <p># of viewers: {roomState.viewer_count}</p>
      </VoteCount>
    </Container>
  );
}
