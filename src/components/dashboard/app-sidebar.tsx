import { RxDashboard } from "react-icons/rx";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BsPersonVideo2 } from "react-icons/bs";
import { RiFileHistoryLine } from "react-icons/ri";
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
} from "@/components/ui/sidebar"
import Image from "next/image"

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
    icon: RiFileHistoryLine ,
  },
  
]

export function AppSidebar() {
  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-2 justify-center items-center">
            <Image
                  src="/assets/online-recruitment.png"
                  height="25"
                  width="25"
                  alt="logo"
            />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold text-lg">
                  HireReady-AI
                </span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <a href={item.url}>
                      <item.icon size={20}/>
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
              <div className="flex gap-3 w-full items-center">
                <Image
                  className="shrink-0"
                  src="/assets/User.png"
                  height="40"
                  width="40"
                  alt="User"
                />
                <span className="flex flex-col flex-1 min-w-0 truncate sidebar-expanded:inline sidebar-collapsed:hidden">
                  <p className="font-semibold text-base truncate">Username</p>
                  <p className="font-medium text-sm truncate">role</p>
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
      </SidebarFooter>
    </Sidebar>
  )
}