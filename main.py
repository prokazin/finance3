from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.get("/")
def root():
    return FileResponse("index.html")

@app.get("/{file_path:path}")
def serve_static(file_path: str):
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}
