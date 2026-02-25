from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from datetime import datetime

app = FastAPI()

# Allow Next.js to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Define what Next.js will send us
class AnalysisRequest(BaseModel):
    job_skills: list[str]
    candidate_skills: list[str]
    github_url: str

@app.post("/api/analyze")
async def analyze_candidate(data: AnalysisRequest):
    # --- 1. SKILL MATH ---
    # Convert to lowercase sets for accurate comparison
    job_set = {s.lower() for s in data.job_skills}
    cand_set = {s.lower() for s in data.candidate_skills}
    
    matched = list(job_set.intersection(cand_set))
    missing = list(job_set.difference(cand_set))
    
    # Calculate score (avoid division by zero)
    score = 0
    if len(job_set) > 0:
        score = round((len(matched) / len(job_set)) * 100)

    # --- 2. GITHUB API INTEGRATION ---
    github_stats = {
        "public_repos": 0,
        "account_age_years": 0,
        "top_language": None
    }
    
    try:
        # Extract username from URL (e.g., https://github.com/das-subho06 -> das-subho06)
        username = data.github_url.rstrip('/').split('/')[-1]
        
        # Fetch user profile
        user_res = requests.get(f"https://api.github.com/users/{username}")
        if user_res.status_code == 200:
            user_data = user_res.json()
            github_stats["public_repos"] = user_data.get("public_repos", 0)
            
            # Calculate account age
            created_at = datetime.strptime(user_data["created_at"], "%Y-%m-%dT%H:%M:%SZ")
            age_days = (datetime.now() - created_at).days
            github_stats["account_age_years"] = round(age_days / 365.25, 1)
            
            # Fetch repos to find top language
            repos_res = requests.get(f"https://api.github.com/users/{username}/repos?per_page=100")
            if repos_res.status_code == 200:
                repos = repos_res.json()
                languages = {}
                for repo in repos:
                    lang = repo.get("language")
                    if lang:
                        languages[lang] = languages.get(lang, 0) + 1
                
                # Find the most frequently used language
                if languages:
                    github_stats["top_language"] = max(languages, key=languages.get)

    except Exception as e:
        print("GitHub fetch error:", e)
        # We don't crash if GitHub fails, we just return zeros

    # --- 3. SEND BACK TO NEXT.JS ---
    return {
        "match_score": score,
        "matched_skills": [s.title() for s in matched], # Capitalize nicely
        "missing_skills": [s.title() for s in missing],
        "github_stats": github_stats
    }

# Run this using: uvicorn main:app --reload