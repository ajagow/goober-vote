
import styled from "@emotion/styled"
import { Card, YELLOW } from "../contants"

interface VoteCardProps {
    title: string
    percentage: number
    voteCount: number
    didVote: boolean
    onClick: () => void
}

const CardVote = styled(Card)<{didVote: boolean}>`
    justify-content: space-between;
    background: ${({didVote}) => didVote ? YELLOW : 'white'}
`

const TitleText = styled.span`
    font-weight: 800;
`

const SubtitleText = styled.span`
    color: grey;
    font-size: 0.75rem;
`

const StatisticsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
`

export const VoteCard = ({title, percentage, voteCount, didVote, onClick} : VoteCardProps) => {
    const displayPercentage = percentage % 1 === 0
    ? percentage.toFixed(0)
    : percentage.toFixed(2);
    return (
        <CardVote didVote={didVote} onClick={onClick}>
            <TitleText>{title} {didVote && '✓'}</TitleText>
            <StatisticsWrapper>
                <TitleText>{displayPercentage}%</TitleText>
                <SubtitleText>{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</SubtitleText>
            </StatisticsWrapper>
        </CardVote>
    )
}