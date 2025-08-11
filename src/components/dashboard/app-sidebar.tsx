import { RxDashboard } from "react-icons/rx";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BsPersonVideo2 } from "react-icons/bs";
import { RiFileHistoryLine } from "react-icons/ri";
import { Pencil } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Editpopup } from "./user/editpopup";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { userDataAtom } from "@/store/atom";
import { is } from "zod/v4/locales";
import { User } from "@/types/userTs";
import { useQuery } from "@tanstack/react-query";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: RxDashboard,
  },
  {
    title: "JD Analyzer",
    url: "#",
    icon: AiOutlineFileSearch,
  },
  {
    title: "Mock Interview",
    url: "#",
    icon: BsPersonVideo2,
  },
  {
    title: "Activity Log",
    url: "#",
    icon: RiFileHistoryLine,
  },
  {
    title: "Logout",
    url: "#",
    icon: RiFileHistoryLine, // Replace with an appropriate logout icon
  },
];

export function AppSidebar() {
  const {user}=useUser();
  const userID=user?.id;
  console.log("User ID:", userID);
  const { signOut } = useClerk();
  const router = useRouter();
  const [userData,setUserData] = useAtom(userDataAtom);
  console.log("User Data:", userData);
  // const [isLoading, setIsLoading] = useState(false);
  const fetchUserData = async (): Promise<User> => {
    const { data } = await axios.get<User>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get/${userID}`
    );
    return data;
  };

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["userData", userID],
    queryFn: fetchUserData,
    enabled: !!userID, // Only run when userID is available
    // onSuccess: (data: User) => setUserData(data),
    // onError: () =>
    //   toast.error("Failed to fetch user data. Please try again later."),
  });
  useEffect(() => {
    if (data) {
      setUserData(data);
    }
    if (isError) {
      toast.error("Failed to fetch user data. Please try again later.");
    }
  }, [data]);
  if(isLoading) {     
    
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-2 justify-center items-center">
            <Image
              src="/assets/logo-transparent-svg.svg"
              height="300"
              width="300"
              alt="logo"
            />
            {/* <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold text-lg">
              HireReady-AI
            </span> */}
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <a
                      href={item.url}
                      onClick={
                        item.title === "Logout"
                          ? (e) => {
                              e.preventDefault();
                              signOut();
                              router.push("/");
                            }
                          : undefined
                      }
                    >
                      <item.icon size={20} />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10">
              <div>
                <div className="flex gap-3 w-full items-center">
                  <Image
                    className="shrink-0"
                    src="/assets/User.png"
                    height="40"
                    width="40"
                    alt="User"
                  />
                  <span className="flex flex-col flex-1 min-w-0 truncate sidebar-expanded:inline sidebar-collapsed:hidden">
                    {userData && userData.username &&(
                      <p className="font-semibold text-base truncate">{userData.username}</p>
                    )}
                    { userData && userData.currentRole && (<p className="font-medium text-sm truncate">{userData.currentRole}</p>)}
                    
                  </span>
                </div>
                <Editpopup />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
