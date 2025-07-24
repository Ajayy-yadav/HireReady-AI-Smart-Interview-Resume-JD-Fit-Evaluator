"use client";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  if (pathName === "/") {
    return <>{children}</>;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
