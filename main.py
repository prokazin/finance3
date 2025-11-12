from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

BASE_DIR = os.getcwd()

@app.get("/")
def home():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/style.css")
def css():
    return FileResponse(os.path.join(BASE_DIR, "style.css"))

@app.get("/script.js")
def js():
    return FileResponse(os.path.join(BASE_DIR, "script.js"))

@app.get("/api/ping")
def ping():
    return {"status": "ok"}
