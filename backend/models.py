import uuid
import random
from typing import Dict, List, Set, Optional

from fastapi import WebSocket
from pydantic import BaseModel


class CreateRoomRequest(BaseModel):
    question: str
    options: List[str]
    single_vote: bool = False


class AddOptionRequest(BaseModel):
    option: str


class Room:
    def __init__(self, question: str, options: List[str], single_vote: bool = False):
        self.id: str = uuid.uuid4().hex[:8]
        self.question: str = question
        self.options: List[str] = list(options)

        self.single_vote: bool = single_vote

        # voter_id -> set of options that voter currently has selected
        self.voter_selections: Dict[str, Set[str]] = {}

        # websocket connection -> voter_id (known immediately at connect time)
        self.connections: Dict[WebSocket, str] = {}

        # is voting open or did we make a selection
        self.is_closed = False
        self.chosen_option: Optional[str] = None

    def add_option(self, option: str) -> bool:
        """Add a new option to the room. Returns False if it already exists."""
        if option in self.options:
            return False
        self.options.append(option)
        return True

    def toggle_vote(self, voter_id: str, option: str) -> bool:
        """
        Toggle a voter's selection for `option`.
        In single_vote rooms, selecting a new option clears any previous one
        (radio-button behavior). In multi-vote rooms, options toggle independently.
        """
        if option not in self.options:
            return False

        selections = self.voter_selections.setdefault(voter_id, set())

        if self.single_vote:
            if option in selections:
                selections.clear()  # clicking your current pick again un-votes
            else:
                selections.clear()  # clear any other pick first
                selections.add(option)
        else:
            if option in selections:
                selections.remove(option)
            else:
                selections.add(option)

        return True

    @property
    def votes(self) -> Dict[str, int]:
        """Tally vote counts per option, computed from voter_selections."""
        tally = {opt: 0 for opt in self.options}
        for selections in self.voter_selections.values():
            for option in selections:
                if option in tally:
                    tally[option] += 1
        return tally

    @property
    def voter_count(self) -> int:
        """Number of distinct people who have at least one active selection."""
        return sum(1 for selections in self.voter_selections.values() if selections)
    
    @property
    def viewer_count(self) -> int:
        """Number of currently open connections (people with the page open)."""
        return len(self.connections)

    def set_chosen_option(self):
        self.chosen_option = random.choice(self.options)
        return self.chosen_option

    async def broadcast_state(self):
        """
        Send room state to every connected client.
        The aggregate `votes` tally is identical for everyone (anonymous, public).
        `my_selections` is personalized per-connection: each client only ever
        sees their own picks, never anyone else's voter_id or selections.
        """
        dead_connections = []

        for ws, voter_id in self.connections.items():
            payload = {
                "type": "room_state",
                "room_id": self.id,
                "question": self.question,
                "votes": self.votes,
                "my_selections": list(self.voter_selections.get(voter_id, set())),
                "voter_count": self.voter_count,
                "viewer_count": self.viewer_count,
                "single_vote": self.single_vote,
                "chosen_option": self.chosen_option,
                "is_closed": self.is_closed
            }
            try:
                await ws.send_json(payload)
            except Exception:
                dead_connections.append(ws)

        for ws in dead_connections:
            del self.connections[ws]


# Global in-memory store: room_id -> Room
rooms: Dict[str, Room] = {}