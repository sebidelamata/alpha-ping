import { 
    ScrollText, 
    Home, 
    TrafficCone, 
    FlaskConical, 
    ReceiptText, 
    Shield, 
    Landmark, 
    Coins, 
    HandCoins 
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/components/ui/sidebar"
  import React from "react"
  import Link from "next/link"
   
  // Menu items.
  const items = [
    {
      title: "Overview",
      url: "./overview",
      icon: Home,
    },
    {
      title: "Litepaper",
      url: "./litepaper",
      icon: ScrollText,
    },
    {
      title: "Roadmap",
      url: "./roadmap",
      icon: TrafficCone,
    },
    {
      title: "Technical Docs",
      url: "./techdocs",
      icon: FlaskConical,
    },
    {
      title: "Contracts",
      url: "./contracts",
      icon: ReceiptText,
    },
    {
        title: "Team",
        url: "./team",
        icon: Shield,
    },
    {
        title: "Governance",
        url: "./governance",
        icon: Landmark,
    },
    {
        title: "Tokenomics",
        url: "./tokenomics",
        icon: Coins,
    },
    {
        title: "Airdrop",
        url: "./airdrop",
        icon: HandCoins,
    },
  ]

  export function DocsSidebar() {
    return (
      <Sidebar>
        <SidebarContent className="bg-primary text-secondary">
          <SidebarGroup className="gap-14">
            <SidebarGroupLabel>
                <h1 className="text-xl text-secondary">AlphaPING Docs</h1>
                <Link 
                    href={'https://alphaping.xyz'} 
                    target="_blank"
                >
                    <img 
                        src="../Apes.svg" 
                        alt="AlphaPING Logo" 
                        className="grid size-12 justify-center object-contain align-middle" 
                        loading="lazy" 
                    />
                </Link>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }
