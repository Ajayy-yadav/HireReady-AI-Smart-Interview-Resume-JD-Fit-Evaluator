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
import { BiEditAlt } from "react-icons/bi";
import { RiLoader2Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useBase64ImageUpload } from "@/hooks/file-upload";
import UserProfile from "./user-profile";
import { FaUserEdit } from "react-icons/fa";
import Image from "next/image";

export function Editpopup() {
  const { user } = useUser();
  const userID = user?.id;
  const [userData, setUserData] = useAtom(userDataAtom);
  const { isUploading, error, uploadedData, uploadImage } =
  useBase64ImageUpload();
  const [username, setUsername] = useState(userData?.username || "");
  const [role, setRole] = useState(userData?.currentRole || "");
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(userData?.imageKey || "");
const [newImage, setNewImage] = useState<string | null>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file);
    setNewImage(URL.createObjectURL(file));
  }
};

const handleUserUpdates = async () => {
  setIsLoading(true);
  try {
    let imageKey = profileImage;

    if (selectedFile) {
      const uploadResult = await uploadImage(selectedFile, userID as string);
      imageKey = uploadResult.key || uploadResult.imageKey || imageKey;
    }

    const newUserData = {
      username,
      currentRole: role,
      imageKey, // ✅ consistent naming
    };

    const response = await axios.patch<User>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update/${userID}`,
      newUserData
    );

    if (response.status === 200) {
      setUserData(response.data);
      toast.success("Profile updated successfully!");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update profile. Please try again.";
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    setUsername(userData?.username || "");
    setRole(userData?.currentRole || "");
    setProfileImage(userData?.imageKey|| "");
  }, [userData]);

  if (!userData) {
    return null;
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div className="flex items-center gap-4 justify-center cursor-pointer">
            
              <FaUserEdit className="h-4 w-4"/>
  
            <p className="font-medium">Edit Profile</p>
          </div>
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
                  {userData && userData.imageKey?(

                      <UserProfile
                        id={userData.id}
                        image={profileImage}
                        avatarStyles="rounded-full h-20 w-20 object-cover"
                      />
                  ):(
                      <Image
                      src={newImage||"/assets/User.png"}
                      height="100"
                      width="100"
                      alt="userimage"
                      className="rounded-full h-10 w-10 object-cover"
                      />
                    )}
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