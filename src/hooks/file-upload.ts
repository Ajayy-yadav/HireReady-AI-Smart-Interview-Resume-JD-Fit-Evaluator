import axios from "axios";
import { useState } from "react";

// Utility to convert file to base64
const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
  const result = reader.result as string;
  const base64 = result.split(',')[1]; // Get only the base64 part
  resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
// Custom Hook
export function useBase64ImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  const uploadImage = async (file:File, userId:string) => {
    setIsUploading(true);
    setError(null);
    setUploadedData(null);

    try {
      const base64Data = await fileToBase64(file);

      const requestData = {
        fileBase64: base64Data,
        filename: file.name,
        mimetype: file.type,
        userId: userId,
      };
      console.log("Request Data:", requestData);
        const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/upload-image-base64`,
        requestData, // This is the payload
        { headers: { "Content-Type": "application/json" } }
);

      if (!(response.status === 200)) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      setUploadedData(response.data);
      return response.data;
    } catch (err:any) {
      setError(err?.message || "Something went wrong");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    error,
    uploadedData,
    uploadImage,
  };
}
