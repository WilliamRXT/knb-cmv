"use client"

import { useState } from "react"
import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { CostForm } from "./cost-form"
import { CostsList } from "./costs-list"
import { MonthlySummary } from "./monthly-summary"
import { LoadingSpinner } from "../loading-spinner"

export function CostsTab() {
  const { globalFixedCostsList, costCategories, isLoading } = useFinancial()
  const [showForm, setShowForm] = useState(false)

  if (isLoading) {
    return <LoadingSpinner />
  }

  const totalMonthlyCosts = globalFixedCostsList
    .filter((cost) => cost.isActive)
    .reduce((sum, cost) => sum + cost.amount, 0)

  const activeCosts = globalFixedCostsList.filter((cost) => cost.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Custos Globais</h1>
          <p className="text-muted-foreground mt-1">Gerencie os custos fixos mensais do seu negócio</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Custo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalMonthlyCosts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{activeCosts.length} custos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo por Dia</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(totalMonthlyCosts / 30).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Média diária</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{costCategories.length}</div>
            <p className="text-xs text-muted-foreground">Tipos de custos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Summary */}
        <MonthlySummary />

        {/* Costs List */}
        <CostsList />
      </div>

      {/* Cost Form Modal */}
      {showForm && <CostForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
