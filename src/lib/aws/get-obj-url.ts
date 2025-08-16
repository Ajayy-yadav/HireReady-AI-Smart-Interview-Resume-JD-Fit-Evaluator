import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { headers } from "next/headers";

export const fetchSignedUrl = async (key: string) => {
  if (!key) throw new Error("Key is required");; // Ensure we get the last part of the key
  
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/aws/signedUrl/${encodeURIComponent(key)}`,
    { responseType: "text" } 
    
  );
  console.log("Signed URL response:", res.data);
  return res.data;
};

export const useSignedUrl = (key: string | null | undefined) =>
  useQuery({
    queryKey: ["signed-url", key],
    queryFn: () => fetchSignedUrl(key!),
    enabled: !!key,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
  });