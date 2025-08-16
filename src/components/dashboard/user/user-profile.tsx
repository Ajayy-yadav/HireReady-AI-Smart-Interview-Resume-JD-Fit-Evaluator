"use client";
import React from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignedUrl } from "@/lib/aws/get-obj-url";


export default function UserProfile({
  id,
  image,
  avatarStyles,
  cwid,
}: {
  id: string;
  image: string;
  avatarStyles?: string;
  cwid?: string;
}) {
  const { data: imageUrl, isLoading } = useSignedUrl(image);
  const router = useRouter();

  if (isLoading) {
    return (
      <div
        className={`${avatarStyles || "h-16 w-16 rounded-full"} flex cursor-pointer items-center justify-center border-2`}
      >
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex shrink-0">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${id}'s avatar`}
          className={avatarStyles || "h-16 w-16 rounded-full"}
        />
      )}
    </div>
  );
}