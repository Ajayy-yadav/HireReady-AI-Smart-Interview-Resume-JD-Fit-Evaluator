import React from 'react'
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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const items = [
  { title: "Dashboard" },
  { title: "Profile" },
  { title: "Settings" },
  { title: "Notifications" },
];

export default function Sidebarskele() {
  return (
    <div>
      <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-2 justify-center items-center">
            <Skeleton height={40} width={40} circle />
            <Skeleton width={120} height={24} />
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <div className="flex items-center gap-2">
                      <Skeleton width={20} height={20} />
                      <Skeleton width={80} height={20} />
                    </div>
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
                <Skeleton height={40} width={40} circle />
                <span className="flex flex-col flex-1 min-w-0 truncate sidebar-expanded:inline sidebar-collapsed:hidden">
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="40%" height={16} />
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </div>
  )
}
