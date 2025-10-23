import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CiMenuKebab } from "react-icons/ci";
import Editpopup from "./user/editpopup";
import { HiOutlineLogout } from "react-icons/hi";
export function Menu() {
  const { signOut } = useClerk();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CiMenuKebab />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 mb-5" align="center">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Editpopup />
        </DropdownMenuLabel>

        <DropdownMenuItem className="flex items-center gap-4 font-medium">
          <HiOutlineLogout className="h-4 w-4" />
          <button
            onClick={(e) => {
              e.preventDefault();
              signOut();
              router.push("/");
            }}
            className="cursor-pointer"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
