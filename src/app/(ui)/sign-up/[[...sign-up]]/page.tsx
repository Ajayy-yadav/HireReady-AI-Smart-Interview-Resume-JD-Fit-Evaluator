"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Particles } from "@/components/ui/particles";
import { useSignUp } from "@clerk/nextjs";
import { SunIcon as Sunburst } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { z } from "zod";
export default function UserSignupPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [userName, setUserName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const router = useRouter();
  const [color] = useState("#ffffff");

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const userSchema = z.object({
    userName: z.string().trim().min(1, "Username is required"),
    currentRole: z.string().trim().min(1, "Current role is required"),
    email: z.string().trim().email("Invalid email address"),
  });

  const handleSubmit = async () => {
    if (!isLoaded) return;
    const validation = userSchema.safeParse({
      userName,
      currentRole,
      email,
    });
    if (!validation.success) {
      console.log(validation.error);
      toast.error(validation.error.issues[0].message);

      return;
    }
    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
      });

      console.log("signUp", signUp);
      console.log("email", email);
      // Prepare phone verification

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setShowOtp(true);
      toast.success("OTP sent to your email");
    } catch (error: any) {
      if (
        error.errors &&
        error.errors[0] &&
        error.errors[0].code === "form_identifier_exists"
      ) {
        toast.error("Account Already Exists , Please Login");
        router.push("/sign-in");
      } else {
        toast.error(error.errors?.[0]?.longMessage || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  console.log("userName", userName);
  console.log("currentRole", currentRole);
  console.log("email", email);
  const handleVerify = async () => {
    if (!otp || !isLoaded) return;

    setIsLoading(true);
    try {
      // Verify phone number
      const verification = await signUp.attemptEmailAddressVerification({
        code: otp,
      });
      console.log("verification", verification);
      console.log("verification status", verification.status);
      if (verification.status === "missing_requirements") {
        console.log("missing fields:", verification.missingFields);
        toast.error("Verification is still pending. Please check your email.");
      }
      if (verification.status === "complete") {
        // Create user in your backend
        await setActive({ session: verification.createdSessionId });
        console.log("User created successfully:", verification.createdUserId);
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create`,
          {
            id: verification.createdUserId,
            username: userName,
            email: email,
            currentRole: currentRole,
          }
        );
        if (res.status === 201) {
          toast.success("Account created successfully!");
          router.push("/dashboard"); // Redirect after successful signup
        }
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      toast.error(
        err.errors?.[0]?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl rounded-lg">
        <div className="w-full h-full z-2 absolute bg-linear-to-t from-transparent to-black"></div>
        <div className="flex absolute z-2 overflow-hidden backdrop-blur-2xl ">
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
        </div>
        <div className="w-[15rem] h-[15rem] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 absolute z-1 rounded-full bottom-0"></div>
        <div className="w-[8rem] h-[5rem] bg-white absolute z-1 rounded-full bottom-0"></div>
        <div className="w-[8rem] h-[5rem] bg-white absolute z-1 rounded-full bottom-0"></div>

        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl  overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight z-10 tracking-tight relative">
            Built for Candidates Who Want to Stand Out.
          </h1>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-99 text-secondary-foreground ">
          <div className="flex flex-col items-left mb-8">
            <div className="text-gray-900 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
              Get Started
            </h2>
            <p className="text-left opacity-80">
              Welcome to HireReady-AI — Let&apos;s get started
            </p>
          </div>
          {!showOtp && (
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserName(e.target.value)
                  }
                  disabled={showOtp}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentRole">Current Role</Label>
                <Input
                  id="currentRole"
                  type="text"
                  placeholder="Enter your current role"
                  value={currentRole}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentRole(e.target.value)
                  }
                  disabled={showOtp}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}
          {showOtp && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOtp(e.target.value)
                }
                required
              />
            </div>
          )}

          {!showOtp ? (
            <>
              <div id="clerk-captcha" />
              <Button
                type="button"
                variant="default"
                className="w-full mt-4 h-10 rounded-md cursor-pointer"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Create Account"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="default"
              className="w-full mt-4 h-10 rounded-md"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          )}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
