import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

REPO_ROOT = Path(__file__).resolve().parent.parent
REPORT_PATH = REPO_ROOT / "artifacts" / "model_report.json"

app = FastAPI(title="Iris ML Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "report_available": REPORT_PATH.exists()}


@app.get("/api/report")
def get_report():
    if not REPORT_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="model_report.json not found. Run the training notebook first: make export",
        )
    try:
        with open(REPORT_PATH) as f:
            return json.load(f)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail=f"model_report.json is malformed: {exc}") from exc
