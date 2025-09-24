"use client"

import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MonthlySummary() {
  const { globalFixedCostsList, costCategories } = useFinancial()

  const activeCosts = globalFixedCostsList.filter((cost) => cost.isActive)
  const totalMonthlyCosts = activeCosts.reduce((sum, cost) => sum + cost.amount, 0)

  // Group costs by category
  const costsByCategory = costCategories
    .map((category) => {
      const categoryCosts = activeCosts.filter((cost) => cost.categoryId === category.id)
      const total = categoryCosts.reduce((sum, cost) => sum + cost.amount, 0)
      const percentage = totalMonthlyCosts > 0 ? (total / totalMonthlyCosts) * 100 : 0

      return {
        ...category,
        total,
        percentage,
        count: categoryCosts.length,
      }
    })
    .filter((category) => category.total > 0)
    .sort((a, b) => b.total - a.total)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Mensal</CardTitle>
        <CardDescription>Distribuição dos custos por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">
              R$ {totalMonthlyCosts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">Total Mensal</p>
          </div>

          <div className="space-y-3">
            {costsByCategory.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">({category.count})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {category.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>

          {costsByCategory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum custo ativo</p>
              <p className="text-sm">Adicione custos para ver o resumo</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
