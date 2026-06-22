import { useParams } from "react-router-dom";
import VotingRoom from "../components/VotingRoom";
import { PageLayout } from "../contants";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <PageLayout>
      {roomId ? <VotingRoom roomId={roomId} /> : <p>No room specified</p>}
    </PageLayout>
  )
}