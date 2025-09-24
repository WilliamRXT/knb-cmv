"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import { useFinancial } from "@/contexts/financial-context"

export function MetricsCards() {
  const { metrics, isLoading } = useFinancial()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Receita Total",
      value: `R$ ${metrics.totalRevenue.toLocaleString("pt-BR")}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Custos Totais",
      value: `R$ ${metrics.totalCosts.toLocaleString("pt-BR")}`,
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Lucro Líquido",
      value: `R$ ${metrics.totalProfit.toLocaleString("pt-BR")}`,
      change: "+18.7%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Margem de Lucro",
      value: `${metrics.profitMargin.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: Target,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendIcon className={`h-3 w-3 ${card.trend === "up" ? "text-primary" : "text-destructive"}`} />
                <span className={card.trend === "up" ? "text-primary" : "text-destructive"}>{card.change}</span>
                <span>vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
