"use client";

import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { isLoaded: authLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(
      "Dashboard useEffect - isLoaded:",
      isLoaded,
      "isSignedIn:",
      isSignedIn,
      "authLoaded:",
      authLoaded,
      "userId:",
      userId
    );

    // Only redirect if we're sure the user is not signed in
    if (authLoaded && !userId) {
      console.log("Redirecting to sign-in from dashboard - no userId");
      // Use window.location.href for immediate redirect
      window.location.href = "/sign-in";
    }
  }, [authLoaded, userId]);

  if (!authLoaded) {
    return (
      <div className="w-full bg-amber-600 flex flex-col items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-full bg-amber-600 flex flex-col items-center justify-center min-h-screen">
        <div className="text-white text-xl">Redirecting to sign-in...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-600 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white py-10">
        This is the Dashboard Page
      </h1>
      <p className="text-center text-white">
        Welcome to the dashboard! Here you can manage your settings and view
        your data.
      </p>
      {user && (
        <p className="text-center text-white mt-4">
          Logged in as: {user.emailAddresses[0]?.emailAddress}
        </p>
      )}
    </div>
  );
}
