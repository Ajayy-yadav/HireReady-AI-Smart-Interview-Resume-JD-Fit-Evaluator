"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = async () => {
    if (!isLoaded || !email) return;
    setIsLoading(true);

    try {
      // Start the sign-in process with email
      await signIn.create({
        identifier: email,
      });

      // Get the email address ID from the list of supported factors
      // const { supportedFirstFactors } = signIn;

      // Find the email code strategy and get the email_address_id
      const emailFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (!emailFactor || !("emailAddressId" in emailFactor)) {
        throw new Error("Email verification not available");
      }

      // Prepare email verification with the correct ID
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      setShowOtp(true);
      toast.success("OTP sent to your email");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(
        err.errors?.[0]?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !isLoaded) return;

    setIsLoading(true);
    try {
      // Verify the OTP code
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: otp,
      });

      if (result.status === "complete") {
        router.push("/doctor");
        toast.success("Login successful");
      } else {
        toast.error("Verification failed. Please try again.");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col gap-4 border border-gray-200 dark:border-gray-700 p-8 rounded-lg w-full max-w-md mx-4 bg-white dark:bg-gray-800 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {showOtp
              ? "Enter the OTP sent to your email"
              : "Enter your email to receive an OTP"}
          </p>
        </div>

        <div className="space-y-4">
          
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-2 focus-visible:ring-primary"
              disabled={showOtp}
            />
          </div>

          {showOtp && (
            <div>
              <Label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-primary"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {!showOtp ? (
          <Button
            variant="default"
            className="w-full mt-2 h-10 rounded-md"
            onClick={handleSendOtp}
            disabled={!email || isLoading}
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              className="w-full h-10 rounded-md"
              onClick={handleVerifyOtp}
              disabled={!otp || isLoading}
            >
              {isLoading ? "Verifying..." : "Login"}
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 rounded-md"
              onClick={() => {
                setShowOtp(false);
                setOtp("");
              }}
              disabled={isLoading}
            >
              Change Email
            </Button>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}