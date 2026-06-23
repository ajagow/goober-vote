import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import styled from "@emotion/styled";
import { ACCENT, BORDER, Button, Card, PageLayout, YELLOW } from "../contants";

interface OptionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  fill: string;
  onClick: () => void;
}

const IconBox = styled.div<{ fill?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 2px solid ${BORDER};
  background: ${({ fill }) => fill ?? "white"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 20px;
  color: ${BORDER};
  margin-right: 16px;
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const JoinButton = styled(Button)`
  background: ${ACCENT};
  color: black;
`;

const JoinContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CancelText = styled.span`
  cursor: pointer;
`;

const OptionCard = ({ icon, title, subtitle, fill, onClick }: OptionCardProps) => {
  return (
    <Card onClick={onClick}>
      <IconBox fill={fill}>{icon}</IconBox>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </Card>
  );
};

const JoinRoom = ({ onCancel }: { onCancel: () => void }) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  return (
    <JoinContainer>
      <Input
        label={"room code"}
        placeholder="room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <JoinButton onClick={() => navigate(`/room/${roomCode}`)}>join</JoinButton>
      <CancelText onClick={onCancel}>cancel</CancelText>
    </JoinContainer>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [showJoinCode, setShowJoinCode] = useState(false);

  return (
    <PageLayout>
      <WelcomeContainer>
        <h2>Welcome</h2>
        <p>Start a new poll or join an existing one.</p>
        <OptionCardContainer>
          <OptionCard
            icon="+"
            title="Create a room"
            subtitle="Set a question and invite people to vote"
            fill={YELLOW}
            onClick={() => navigate("/create")}
          />
          {showJoinCode ? (
            <JoinRoom onCancel={() => setShowJoinCode(false)} />
          ) : (
            <OptionCard
              icon="→"
              title="Join a room"
              subtitle="Enter a room code to vote live"
              fill={ACCENT}
              onClick={() => setShowJoinCode((prev) => !prev)}
            />
          )}
        </OptionCardContainer>
      </WelcomeContainer>
    </PageLayout>
  );
}
