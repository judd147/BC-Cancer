import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { useAuth } from "../AuthContext";

// Define the Zod schema
const loginSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters" })
    .max(20, { message: "Username must not exceed 20 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must not exceed 20 characters" }),
});

export function LoginForm({
  isSignup,
  toggleMode,
}: {
  isSignup: boolean;
  toggleMode: () => void;
}) {
  const navigate = useNavigate();
  const { setIsAuthed, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const handleSignup = async () => {
    try {
      // validation
      loginSchema.parse({ username, password });
      // send request to backend
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      // error handling
      if (!response.ok) {
        if (response.status === 400) {
          setErrors({
            username: "username already exists",
          });
        }
      } else {
        const data = await response.json();
        // console.log("Signed up successfully:", data);
        setIsAuthed(true);
        setUser({ id: data.id, username: data.username });
        navigate("/events");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors({
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
        });
      }
    }
  };

  const handleLogin = async () => {
    try {
      // validation
      loginSchema.parse({ username, password });
      // send request to backend
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ username, password }),
      });
      // error handling
      if (!response.ok) {
        if (response.status === 404) {
          setErrors({
            username: "username not found",
          });
        } else if (response.status === 400) {
          setErrors({
            password: "password does not match our records",
          });
        }
      } else {
        const data = await response.json();
        //console.log("Logged in successfully:", data);
        setIsAuthed(true);
        setUser({ id: data.id, username: data.username });
        navigate("/events");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors({
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
        });
      }
    }
  };

  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isSignup ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {isSignup
            ? "Enter your username below to login to your account"
            : "Enter your username and password below to start"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <span className="text-red-500 text-sm font-medium">
                {errors.username}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm font-medium">
                {errors.password}
              </span>
            )}
          </div>
          {isSignup ? (
            <Button type="button" className="w-full" onClick={handleLogin}>
              Login
            </Button>
          ) : (
            <Button type="button" className="w-full" onClick={handleSignup}>
              Register
            </Button>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          {isSignup ? (
            <>
              Don't have an account?{" "}
              <a href="#" className="underline" onClick={toggleMode}>
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="#" className="underline" onClick={toggleMode}>
                Login
              </a>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
