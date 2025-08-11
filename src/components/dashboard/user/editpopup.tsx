import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";

export function Editpopup() {
    const {user}=useUser();
    const [username, setUsername] = useState(user?.username || "ajay");
    console.log("user",user);
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline"><FaUserEdit /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Username</Label>
              <Input id="username-1" name="username" defaultValue={username} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Role</Label>
              <Input id="role-1" name="role" defaultValue="student" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
