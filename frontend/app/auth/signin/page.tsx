"use client"
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, User, Building2 } from "lucide-react"
import { CredentialResponse } from "@react-oauth/google";
export default function SignInPage() {
  const router = useRouter()
  const [role, setRole] = useState<"recruiter" | "candidate" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/signin", { email, password });
      if (role === "recruiter") router.push("/recruiter/dashboard");
      else router.push("/candidate/dashboard");
    } catch (error) {
      alert(error.response.data.message || "Sign In Failed");
    }
  }
async function handleGoogleLogin(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) return;
    // decode JWT
    try {
      const res = await axios.post("/api/auth/google", {
        token: credentialResponse.credential,
        role, // important: get role from selector
      });
      alert("Google sign-in successful!");
      if (role === "recruiter") router.push("/recruiter/dashboard");
      else router.push("/candidate/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Google sign-in failed");
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex items-center justify-center px-6 py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-mono text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your HireSmart account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("recruiter")}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      role === "recruiter"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Building2 className="h-6 w-6" />
                    <span className="text-sm font-medium">Recruiter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      role === "candidate"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <User className="h-6 w-6" />
                    <span className="text-sm font-medium">Candidate</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" 
                value={email}
  onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" 
                value={password}
  onChange={(e) => setPassword(e.target.value)} />
              </div>

              <Button type="submit" className="w-full" disabled={!role}>
                Sign In
              </Button>
 
      {/* Google login button */}
      <div>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google Sign In Failed")}
        />
      </div>
              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
