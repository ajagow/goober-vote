import os
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from models import Room, CreateRoomRequest, AddOptionRequest, rooms

app = FastAPI(title="Voting Rooms")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    os.environ.get("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in ALLOWED_ORIGINS if origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- REST endpoints ----------

@app.post("/rooms")
def create_room(req: CreateRoomRequest):
    room = Room(req.question, req.options, single_vote=req.single_vote)
    rooms[room.id] = room
    return {"room_id": room.id, "question": room.question, "options": room.options, "single_vote": room.single_vote}


@app.get("/rooms/{room_id}")
def get_room(room_id: str):
    room = rooms.get(room_id)
    if not room:
        return {"error": "Room not found"}
    return {
        "room_id": room.id,
        "question": room.question,
        "options": room.options,
        "votes": room.votes,
    }


@app.post("/rooms/{room_id}/options")
async def add_option(room_id: str, req: AddOptionRequest):
    room = rooms.get(room_id)
    if not room:
        return {"error": "Room not found"}

    added = room.add_option(req.option)
    if not added:
        return {"error": "Option already exists"}

    await room.broadcast_state()
    return {"room_id": room.id, "options": room.options, "votes": room.votes}


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------- WebSocket endpoint ----------

@app.websocket("/ws/rooms/{room_id}")
async def room_websocket(websocket: WebSocket, room_id: str, voter_id: Optional[str] = None):
    room = rooms.get(room_id)
    if not room:
        await websocket.close(code=4404)
        return

    if not voter_id:
        await websocket.close(code=4400)  # bad request: no voter_id provided
        return

    await websocket.accept()
    room.connections[websocket] = voter_id
    await room.broadcast_state()

    try:
        while True:
            data = await websocket.receive_json()

            if data.get("type") == "vote":
                option = data.get("option")
                if option and room.toggle_vote(voter_id, option):
                    await room.broadcast_state()

            if data.get("type") == "add-option":
                option = data.get("option")
                room.add_option(option)
                await room.broadcast_state()

    except WebSocketDisconnect:
        room.connections.pop(websocket, None)