"use client";

import React, { useState } from "react";

export default function page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full bg-amber-600 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white py-10">
        This is the Dashboard Page
      </h1>
      <p className="text-center text-white">
        Welcome to the dashboard! Here you can manage your settings and view
        your data.
      </p>
    </div>
  );
}
