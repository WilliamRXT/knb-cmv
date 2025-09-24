"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "./sidebar"
import { OverviewTab } from "./overview/overview-tab"
import { CostsTab } from "./costs/costs-tab"
import { ProductsTab } from "./products/products-tab"
import { MarginsTab } from "./margins/margins-tab"
import { BreakevenTab } from "./breakeven/breakeven-tab"
import { ScenariosTab } from "./scenarios/scenarios-tab"
import { useFinancial } from "@/contexts/financial-context"
import { LoadingSpinner } from "./loading-spinner"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { isLoading } = useFinancial()

  useEffect(() => {
    const savedTab = localStorage.getItem("knb-active-tab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem("knb-active-tab", tab)
  }

  const getTabTitle = (tab: string) => {
    const titles: Record<string, string> = {
      overview: "Visão Geral",
      products: "Produtos",
      costs: "Custos",
      margins: "Margens",
      breakeven: "Ponto de Equilíbrio",
      scenarios: "Cenários",
      settings: "Configurações",
    }
    return titles[tab] || "Dashboard"
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab />
      case "products":
        return <ProductsTab />
      case "costs":
        return <CostsTab />
      case "margins":
        return <MarginsTab />
      case "breakeven":
        return <BreakevenTab />
      case "scenarios":
        return <ScenariosTab />
      case "settings":
        return <div className="p-6">Configurações - Em desenvolvimento</div>
      default:
        return <OverviewTab />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">KNB Gestor</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getTabTitle(activeTab)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
