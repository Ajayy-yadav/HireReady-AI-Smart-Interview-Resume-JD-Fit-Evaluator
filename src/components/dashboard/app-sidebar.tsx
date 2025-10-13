"use client";

import { LayoutDashboard, FileSearch, Video, Clock } from "lucide-react";
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
import { useRouter, usePathname } from "next/navigation";

import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import { userDataAtom } from "@/store/atom";
import type { User } from "@/types/userTs";
import { useQuery } from "@tanstack/react-query";

import Sidebarskele from "@/skeleton-loaders/sidebar-skele";

import UserProfile from "./user/user-profile";
import { Menu } from "./menu";
import { GradientButton } from "@/components/ui/gradient-button";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics Hub",
  },
  {
    title: "Resume Analyzer",
    url: "/resume-analyzer",
    icon: FileSearch,
    description: "AI-Powered Job Matching",
  },
  {
    title: "Interview Practice",
    url: "/mock-interview",
    icon: Video,
    description: "Mock Interview Sessions",
  },
  {
    title: "Activity History",
    url: "/activity-log",
    icon: Clock,
    description: "Recent Actions & Progress",
  },
];

export function AppSidebar() {
  const { user } = useUser();
  const userID = user?.id;
  console.log("User ID:", userID);
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useAtom(userDataAtom);
  console.log("User Data:", userData);

  const fetchUserData = async (): Promise<User> => {
    const { data } = await axios.get<User>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get/${userID}`
    );
    return data;
  };

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["userData", userID],
    queryFn: fetchUserData,
    enabled: !!userID,
    select: (data: User) => {
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
    if (isError) {
      toast.error("Failed to fetch user data. Please try again later.");
    }
  }, [isError, data]);

  console.log(
    "UserImage:",
    userData?.imageKey ? userData?.imageKey : "No Image"
  );

  if (isLoading) {
    return <Sidebarskele />;
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-2 justify-center items-center py-4 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
            <div className="relative group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
              <Image
                src="/assets/logo-transparent-svg.svg"
                height="180"
                width="180"
                alt="logo"
                className="transition-all duration-200 hover:scale-105 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6"
              />
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent className="pt-6 px-2 group-data-[collapsible=icon]:px-0">
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    {isActive ? (
                      <GradientButton
                        variant="variant"
                        asChild
                        className="h-12 w-full rounded-xl transition-all duration-200 hover:shadow-sm group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:min-w-0 group-data-[collapsible=icon]:px-0 min-w-0 px-3 py-3"
                      >
                        <a
                          href={item.url}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(item.url);
                          }}
                          className="flex items-center gap-4 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center"
                        >
                          <div className="flex items-center justify-center w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5">
                            <item.icon
                              size={20}
                              className="text-current group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4"
                            />
                          </div>

                          <div className="flex flex-col flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                            <span className="text-sm font-medium text-current truncate">
                              {item.title}
                            </span>
                            <span className="text-xs text-white/70 truncate">
                              {item.description}
                            </span>
                          </div>
                        </a>
                      </GradientButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className="h-12 rounded-xl transition-all duration-200 hover:bg-accent/80 hover:shadow-sm group group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto"
                      >
                        <a
                          href={item.url}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(item.url);
                          }}
                          className="flex items-center gap-4 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center"
                        >
                          <div className="flex items-center justify-center w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5">
                            <item.icon
                              size={20}
                              className="text-current group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4"
                            />
                          </div>

                          <div className="flex flex-col flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                            <span className="text-sm font-medium text-current truncate">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </span>
                          </div>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
            >
              <div className="w-full group-data-[collapsible=icon]:w-auto">
                <div className="flex gap-3 w-full items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:w-auto">
                  <div className="relative flex-shrink-0">
                    {userData && userData.imageKey ? (
                      <UserProfile
                        id={userData.id}
                        image={
                          userData.imageKey.length > 0
                            ? userData.imageKey
                            : "/assets/User.png"
                        }
                        avatarStyles="rounded-full h-10 w-10 object-cover ring-2 ring-background shadow-sm group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:ring-1"
                      />
                    ) : (
                      <Image
                        src="/assets/User.png"
                        height="40"
                        width="40"
                        alt="userimage"
                        className="rounded-full h-10 w-10 object-cover ring-2 ring-background group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:ring-1"
                      />
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background group-data-[collapsible=icon]:w-2 group-data-[collapsible=icon]:h-2 group-data-[collapsible=icon]:ring-1 group-data-[collapsible=icon]:-bottom-0 group-data-[collapsible=icon]:-right-0"></div>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    {userData && userData.username && (
                      <p className="font-semibold text-sm text-foreground truncate">
                        {userData.username}
                      </p>
                    )}
                    {userData && userData.currentRole && (
                      <p className="font-normal text-xs text-muted-foreground truncate">
                        {userData.currentRole}
                      </p>
                    )}
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 group-data-[collapsible=icon]:hidden">
                  <Menu />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
