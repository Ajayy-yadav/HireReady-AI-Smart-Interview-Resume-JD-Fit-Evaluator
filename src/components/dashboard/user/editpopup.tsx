import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userDataAtom } from "@/store/atom";
import { User } from "@/types/userTs";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useBase64ImageUpload } from "@/hooks/file-upload";

export function Editpopup() {
  const { user } = useUser();
  const userID = user?.id;
  const [userData, setUserData] = useAtom(userDataAtom);
  const { isUploading, error, uploadedData, uploadImage } =
  useBase64ImageUpload();
  const [username, setUsername] = useState(userData?.username || "");
  const [role, setRole] = useState(userData?.currentRole || "");
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(userData?.imageUrl || "");
  const [newImage, setNewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewImage(imageURL);
    }
  };

  const handleUserUpdates = async () => {
    setIsLoading(true);
    try {
      let imageUrl = profileImage;
      // If a new image is selected, upload it first
      if (newImage && newImage !== profileImage) {
        const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          const uploadResult = await uploadImage(file, userID as string);
          imageUrl = uploadResult.url || uploadResult.imageUrl || imageUrl;
        }
      }
      const newUserData = {
        username: username,
        currentRole: role,
        imageUrl: imageUrl,
      };
      if (newUserData.username && newUserData.currentRole) {
        const response = await axios.patch<User>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update/${userID}`,
          newUserData
        );
        if (response.status === 200) {
          setUserData(response.data);
          toast.success("Profile updated successfully!");
        }
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUsername(userData?.username || "");
    setRole(userData?.currentRole || "");
    setProfileImage(userData?.imageUrl || "");
  }, [userData]);

  if (!userData) {
    return null;
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <FaUserEdit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center">
              <RiLoader2Fill className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Profile Image with edit icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={newImage || profileImage || "/default-avatar.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                  >
                    <MdEdit className="text-gray-600" />
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Role */}
              <div className="grid gap-3">
                <Label htmlFor="role-1">Role</Label>
                <Input
                  id="role-1"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleUserUpdates}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
export default Editpopup;