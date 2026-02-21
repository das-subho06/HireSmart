from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "HireSmart Backend Running 🚀"}

@app.post("/analyze")
def analyze(data: dict):
    github_username = data.get("github")
    return {
        "score": 85,
        "github": github_username,
        "message": "Analysis completed successfully"
    }