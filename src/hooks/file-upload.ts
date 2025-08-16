import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export function useBase64ImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<any>(null);

  const uploadImage = async (file: File, userId: string) => {
    setIsUploading(true);
    setError(null);
    setUploadedData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
  

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/aws/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("upload successful");
      }

      setUploadedData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
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
