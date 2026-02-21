"use client"

import { useState } from "react"

export default function Home() {
  const [github, setGithub] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ github })
    })

    const data = await response.json()
    setResult(data)
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">HireSmart</h1>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
        className="border p-2 mr-3"
      />

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>

      {result && (
        <div className="mt-6 border p-4">
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>GitHub:</strong> {result.github}</p>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  )
}