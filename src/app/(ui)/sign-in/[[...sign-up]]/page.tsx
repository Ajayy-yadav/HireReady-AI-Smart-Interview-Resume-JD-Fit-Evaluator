"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { SunIcon as Sunburst } from "lucide-react";
import { Particles } from "@/components/ui/particles";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [color] = useState("#ffffff");
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
        (factor: any) => factor.strategy === "email_code"
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
        toast.success("Login successful");
        // Wait a bit for the session to be established, then redirect
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
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
    <div className="min-h-screen  flex items-center justify-center overflow-hidden bg-black">
      <div className=" w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl rounded-lg">
        <div className="w-full h-full z-2 absolute bg-linear-to-t from-transparent to-black"></div>
        <div className="flex absolute z-2  overflow-hidden backdrop-blur-2xl ">
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
            Welcome back! Let’s continue your smart prep journey.
          </h1>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-99 text-secondary-foreground ">
          <div className="flex flex-col items-left mb-8">
            <div className="text-gray-900 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOtp(e.target.value)
                  }
                  className="focus-visible:ring-2 focus-visible:ring-primary mb-4"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {!showOtp ? (
            <Button
              variant="default"
              className="w-full mt-5 h-10 rounded-md"
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
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/sign-up")}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
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
