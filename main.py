from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
import os
from datetime import datetime

app = FastAPI()
BASE_DIR = os.getcwd()

records = []

@app.get("/")
def home():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/style.css")
def css():
    return FileResponse(os.path.join(BASE_DIR, "style.css"))

@app.get("/script.js")
def js():
    return FileResponse(os.path.join(BASE_DIR, "script.js"))

@app.get("/records")
def get_records():
    return JSONResponse(content=records)

@app.post("/records")
async def add_record(req: Request):
    data = await req.json()
    data["date"] = datetime.now().isoformat()
    records.append(data)
    return {"status": "ok"}

@app.delete("/records/{index}")
def delete_record(index: int):
    if 0 <= index < len(records):
        records.pop(index)
        return {"status": "deleted"}
    return {"status": "not found"}

@app.get("/api/ping")
def ping():
    return {"status": "ok"}
