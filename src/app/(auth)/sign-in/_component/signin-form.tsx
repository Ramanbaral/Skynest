"use client";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { OAuthStrategy } from "@clerk/types";

import { signInSchema } from "@/schemas/signInSchema";
import { cn } from "@/lib/utils";
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

export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
  type SignInFormData = z.infer<typeof signInSchema>;

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!signIn) return null;

  async function onSubmit(data: SignInFormData) {
    if (!isLoaded) return;
    try {
      setIsSubmitting(true);
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        router.replace("/dashboard");
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        if (e.status === 422) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(e.message);
        }
      }
      console.log("Error during signin - ", e);
    } finally {
      setIsSubmitting(false);
    }
  }

  const signInWithGoogle = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  className={errors.email?.message && `border-destructive`}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <p className="text-destructive text-sm">{errors.email?.message}</p>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  {...register("password")}
                  className={errors.password?.message && `border-destructive`}
                  id="password"
                  type="password"
                  required
                />
                <p className="text-destructive text-sm">{errors.password?.message}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent black-blue-500"></div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </div>
          </form>
          <Button
            variant="outline"
            className="w-full mt-5"
            onClick={() => signInWithGoogle("oauth_google")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
