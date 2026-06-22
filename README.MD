# Goober Vote

Create live voting rooms and watch results update in real time.

## Stack

- **Backend**: FastAPI (Python) + WebSockets, in-memory room storage
- **Frontend**: React + TypeScript, Emotion for styling

## Project structure

```
.
├── backend/
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
└── frontend/
    ├── src/
    └── public/
```

## Running locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be running at `http://localhost:8000`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

### Environment variables (frontend)

Create `frontend/.env` for local development:

```
REACT_APP_API_URL=http://localhost:8000
```

## Deployment

- **Backend** is deployed on [Railway](https://railway.app). The start command is:

  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

  Set the `FRONTEND_URL` environment variable in Railway to your deployed frontend's URL, so CORS allows requests from it.

- **Frontend** is deployed on [Netlify](https://netlify.com), built from the `frontend/` directory:

  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/build`
  - Environment variable: `REACT_APP_API_URL` set to the live backend URL

  A `public/_redirects` file with `/* /index.html 200` is required so client-side routes (e.g. `/room/:id`) work on page refresh/direct navigation.

## Notes

- Rooms are stored in memory and are **not persisted** — restarting the backend clears all rooms.