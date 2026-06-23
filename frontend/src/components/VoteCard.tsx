import styled from "@emotion/styled";
import { Card, YELLOW } from "../contants";

interface VoteCardProps {
  title: string;
  percentage: number;
  voteCount: number;
  didVote: boolean;
  onClick: () => void;
  disabled: boolean;
}

const CardVote = styled(Card)<{ didVote: boolean; disabled: boolean }>`
  justify-content: space-between;
  background: ${({ didVote }) => (didVote ? YELLOW : "white")};
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const TitleText = styled.span`
  font-weight: 800;
`;

const SubtitleText = styled.span`
  color: grey;
  font-size: 0.75rem;
`;

const StatisticsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

export const VoteCard = ({
  title,
  percentage,
  voteCount,
  didVote,
  onClick,
  disabled,
}: VoteCardProps) => {
  const displayPercentage = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);
  return (
    <CardVote
      didVote={didVote}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      disabled={disabled}
    >
      <TitleText>
        {title} {didVote && "✓"}
      </TitleText>
      <StatisticsWrapper>
        <TitleText>{displayPercentage}%</TitleText>
        <SubtitleText>
          {voteCount} {voteCount === 1 ? "vote" : "votes"}
        </SubtitleText>
      </StatisticsWrapper>
    </CardVote>
  );
};
