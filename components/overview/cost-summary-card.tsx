"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinancial } from "@/contexts/financial-context"

export function CostSummaryCard() {
  const { globalFixedCosts } = useFinancial()

  const totalFixedCosts = Object.values(globalFixedCosts).reduce((sum, cost) => sum + cost, 0)

  const costItems = [
    { label: "Aluguel", value: globalFixedCosts.rent },
    { label: "Energia/Água", value: globalFixedCosts.utilities },
    { label: "Funcionários", value: globalFixedCosts.employees },
    { label: "Marketing", value: globalFixedCosts.marketing },
    { label: "Outros", value: globalFixedCosts.other },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumo de Custos Fixos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {costItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-medium">R$ {item.value.toLocaleString("pt-BR")}</span>
          </div>
        ))}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center font-semibold">
            <span>Total Mensal</span>
            <span className="text-primary">R$ {totalFixedCosts.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
