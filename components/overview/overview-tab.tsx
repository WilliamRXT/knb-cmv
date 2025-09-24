"use client"

import { MetricsCards } from "./metrics-cards"
import { BrandStatusCard } from "./brand-status-card"
import { CostSummaryCard } from "./cost-summary-card"
import { NextStepsCard } from "./next-steps-card"

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Visão Geral</h2>
        <p className="text-muted-foreground mt-2">Acompanhe o desempenho financeiro das suas marcas em tempo real</p>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandStatusCard />
        <CostSummaryCard />
      </div>

      <NextStepsCard />
    </div>
  )
}
