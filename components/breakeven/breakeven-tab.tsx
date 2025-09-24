"use client"

import { useState } from "react"
import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Target, TrendingUp, Lightbulb } from "lucide-react"
import { BreakevenTips } from "./breakeven-tips"
import { LoadingSpinner } from "../loading-spinner"

export function BreakevenTab() {
  const { globalFixedCostsList, products, brands, isLoading } = useFinancial()
  const [isCalculating, setIsCalculating] = useState(false)

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Simular loading para cálculos complexos
  const handleCalculation = async () => {
    setIsCalculating(true)
    // Simular delay de cálculo
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsCalculating(false)
  }

  // Calcular custos fixos totais
  const totalFixedCosts = globalFixedCostsList
    .filter((cost) => cost.isActive)
    .reduce((total, cost) => total + cost.amount, 0)

  // Calcular margem de contribuição média ponderada
  const calculateWeightedAverageMargin = () => {
    if (products.length === 0) return 0

    const totalMargin = products.reduce((sum, product) => {
      return sum + (product.price - product.cmv)
    }, 0)

    return totalMargin / products.length
  }

  const averageMargin = calculateWeightedAverageMargin()
  const dailyBreakeven = averageMargin > 0 ? Math.ceil(totalFixedCosts / averageMargin / 30) : 0
  const monthlyBreakeven = averageMargin > 0 ? Math.ceil(totalFixedCosts / averageMargin) : 0

  // Determinar status do ponto de equilíbrio
  const getBreakevenStatus = (daily: number) => {
    if (daily <= 20) return { status: "excellent", variant: "default", text: "Excelente" }
    if (daily <= 40) return { status: "good", variant: "secondary", text: "Bom" }
    if (daily <= 60) return { status: "warning", variant: "outline", text: "Atenção" }
    return { status: "critical", variant: "destructive", text: "Crítico" }
  }

  const breakevenStatus = getBreakevenStatus(dailyBreakeven)

  // Calcular por marca
  const breakevenByBrand = brands
    .map((brand) => {
      const brandProducts = products.filter((p) => p.brandId === brand.id)
      if (brandProducts.length === 0) return null

      const brandAverageMargin =
        brandProducts.reduce((sum, product) => {
          return sum + (product.price - product.cmv)
        }, 0) / brandProducts.length

      const brandDailyBreakeven = brandAverageMargin > 0 ? Math.ceil(totalFixedCosts / 2 / brandAverageMargin / 30) : 0

      return {
        brand,
        averageMargin: brandAverageMargin,
        dailyBreakeven: brandDailyBreakeven,
        status: getBreakevenStatus(brandDailyBreakeven),
      }
    })
    .filter(Boolean)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ponto de Equilíbrio</h1>
        <p className="text-muted-foreground mt-2">
          Quantos hambúrgueres você precisa vender para cobrir todos os custos
        </p>
      </div>

      {/* Meta Diária Principal */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Meta Diária</CardTitle>
          </div>
          <CardDescription>Para não ter prejuízo, você precisa vender pelo menos:</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {isCalculating ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-4">
              <div className="text-6xl font-bold text-primary">{dailyBreakeven}</div>
              <div className="text-xl text-muted-foreground">hambúrgueres por dia</div>
              <Badge variant={breakevenStatus.variant as any} className="text-lg px-4 py-2">
                {breakevenStatus.text}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerta se meta está alta */}
      {breakevenStatus.status === "critical" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção!</strong> Sua meta diária está muito alta. Considere reduzir custos fixos ou aumentar a
            margem dos produtos.
          </AlertDescription>
        </Alert>
      )}

      {breakevenStatus.status === "warning" && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>Cuidado!</strong> Sua meta diária está um pouco alta. Monitore suas vendas e considere otimizações.
          </AlertDescription>
        </Alert>
      )}

      {/* Detalhes por Marca */}
      <div className="grid gap-6 md:grid-cols-2">
        {breakevenByBrand.map((item) => (
          <Card key={item.brand.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.brand.color }} />
                  {item.brand.name}
                </CardTitle>
                <Badge variant={item.status.variant as any}>{item.status.text}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{item.dailyBreakeven}</div>
                  <div className="text-sm text-muted-foreground">hambúrgueres/dia</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Margem Média</div>
                    <div className="font-semibold">R$ {item.averageMargin.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Meta Mensal</div>
                    <div className="font-semibold">{Math.ceil(item.dailyBreakeven * 30)} unidades</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo do Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-card border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">R$ {totalFixedCosts.toLocaleString("pt-BR")}</div>
              <div className="text-sm text-muted-foreground">Custos Fixos Mensais</div>
            </div>

            <div className="text-center p-4 bg-card border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">R$ {averageMargin.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Margem Média por Hambúrguer</div>
            </div>

            <div className="text-center p-4 bg-card border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">{monthlyBreakeven}</div>
              <div className="text-sm text-muted-foreground">Meta Mensal Total</div>
            </div>
          </div>

          <div className="mt-4 p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-muted rounded-lg">
                <Lightbulb className="h-5 w-5 text-foreground" />
              </div>
              <span className="font-semibold text-foreground text-lg">Como funciona o cálculo:</span>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p className="font-medium">Ponto de Equilíbrio = Custos Fixos ÷ Margem de Contribuição Média</p>
              <p className="font-medium">Meta Diária = Ponto de Equilíbrio ÷ 30 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas para Reduzir Ponto de Equilíbrio */}
      <BreakevenTips currentBreakeven={dailyBreakeven} status={breakevenStatus.status} />
    </div>
  )
}
