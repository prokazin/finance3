from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.get("/")
def home():
    return FileResponse("index.html")

@app.get("/style.css")
def css():
    return FileResponse("style.css")

@app.get("/script.js")
def js():
    return FileResponse("script.js")

@app.get("/api/ping")
def ping():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
