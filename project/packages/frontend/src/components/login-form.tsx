import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  isSignup,
  toggleMode,
}: {
  isSignup: boolean;
  toggleMode: () => void;
}) {
  const navigate = useNavigate();
  const { setIsAuthed, setUser } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSignup = async (values: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 400) {
          form.setError("username", {
            type: "manual",
            message: "Username already exists",
          });
          return;
        }
      }

      const data = await response.json();
      setIsAuthed(true);
      setUser({ id: data.id, username: data.username });
      navigate("/events");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 404) {
          form.setError("username", {
            type: "manual",
            message: "Username not found",
          });
          return;
        } else if (response.status === 400) {
          form.setError("password", {
            type: "manual",
            message: "Password does not match our records",
          });
          return;
        }
      }

      const data = await response.json();
      setIsAuthed(true);
      setUser({ id: data.id, username: data.username });
      navigate("/events");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    if (isSignup) {
      await handleLogin(values);
    } else {
      await handleSignup(values);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <a href="#" className="text-sm underline">
                      Forgot your password?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isSignup ? "Login" : "Register"}
            </Button>

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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}