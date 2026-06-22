import { useRoomSocket } from "../utils/useRoomSocket";
import { useState } from "react";
import { VoteCard } from "./VoteCard";
import styled from "@emotion/styled";
import { Input } from "./Input";
import { ACCENT, Button } from "../contants";


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

export default function VotingRoom({ roomId }: VotingRoomProps) {
  const { roomState, status, vote, addOption, mySelections } = useRoomSocket(roomId);
  const [customOption, setCustomOption] = useState("")


  if (status === "connecting") {
    return <p>Connecting to room...</p>;
  }

  if (status === "error" || status === "disconnected") {
    return <p>Connection lost. Try refreshing.</p>;
  }

  if (!roomState) {
    return <p>Waiting for room data...</p>;
  }

  const totalVotes = Object.values(roomState.votes).reduce((a, b) => a + b, 0);

  const onSubmitCustomOption = () => {
    addOption(customOption)
    setCustomOption("")
  }

  return (
    <div>
      <h2>{roomState.question}</h2>
      <OptionsContainer>
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