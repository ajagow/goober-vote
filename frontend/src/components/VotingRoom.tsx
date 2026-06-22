import { useRoomSocket } from "../utils/useRoomSocket";
import { useEffect, useState } from "react";
import { VoteCard } from "./VoteCard";
import styled from "@emotion/styled";
import { Input } from "./Input";
import { ACCENT, BLUE, Button, ErrorBanner } from "../contants";
import { useNavigate } from "react-router-dom";
import { CopyButton } from "./CopyButton";


type VotingRoomProps = {
  roomId: string;
};

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`

const AddButton = styled(Button)`
  background: ${ACCENT};
  color: white;
`

const VoteCount = styled.p`
  text-align: right;
  margin-top: 20px;
  color: lightgrey;
`

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: max-content;
  margin: auto;
`

const Header = styled.div`
    display: grid;
    align-items: self-start;
    grid-template-columns: auto max-content;
`

export default function VotingRoom({ roomId }: VotingRoomProps) {
  const { roomState, status, vote, addOption, mySelections } = useRoomSocket(roomId);
  const [customOption, setCustomOption] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    setError("")
  }, [customOption])

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
        <Button onClick={() => navigate("/")} backgroundColor={BLUE}>go back home</Button>
      </NotFoundContainer>
    )
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
    <div>
      <Header>
        <h2>{roomState.question}</h2>
        <CopyButton />
      </Header>
      <OptionsContainer>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        {
          Object.entries(roomState.votes).map(([option, count]) => {
            const percentage = count ? ((count / totalVotes) * 100) : 0
            return(
                <VoteCard key={option} onClick={() => vote(option)}  title={option} percentage={percentage} voteCount={count} didVote={mySelections.has(option)} />
          )})
        }

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
        <Input 
          label="custom option" 
          type="text"
          placeholder="add your own option..."
          value={customOption}
          onChange={(e) => setCustomOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmitCustomOption()
            }
          }}
        />
        <AddButton
          onClick={onSubmitCustomOption}
        >
          add
        </AddButton>
      </div>

      </OptionsContainer>

      <VoteCount>
        <p>total votes: {totalVotes}</p>
        <p># of voters: {roomState.voter_count}</p>
        <p># of viewers: {roomState.viewer_count}</p>
      </VoteCount>
    </div>
  );
}