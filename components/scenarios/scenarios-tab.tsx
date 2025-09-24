"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useFinancial } from "@/contexts/financial-context"
import { TrendingUp, TrendingDown, DollarSign, Calculator, Target, AlertTriangle, Users, User } from "lucide-react"
import { LoadingSpinner } from "../loading-spinner"

interface Scenario {
  id: string
  name: string
  dailySales: number
  priceMultiplier: number
  monthlyRevenue: number
  monthlyProfit: number
  profitMargin: number
  status: "excellent" | "good" | "warning" | "critical"
}

interface ProductScenario {
  productId: string
  dailySales: number
  priceMultiplier: number
}

export function ScenariosTab() {
  const { products, globalFixedCostsList, isLoading } = useFinancial()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isGlobalMode, setIsGlobalMode] = useState(false)
  const [globalScenario, setGlobalScenario] = useState({
    dailySales: 50,
    priceMultiplier: 1,
  })
  const [individualScenarios, setIndividualScenarios] = useState<ProductScenario[]>(
    products.map((product) => ({
      productId: product.id,
      dailySales: 50,
      priceMultiplier: 1,
    })),
  )
  const [isCalculating, setIsCalculating] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const applyGlobalChanges = () => {
    setIndividualScenarios((prev) =>
      prev.map((scenario) =>
        selectedProducts.includes(scenario.productId)
          ? { ...scenario, dailySales: globalScenario.dailySales, priceMultiplier: globalScenario.priceMultiplier }
          : scenario,
      ),
    )
  }

  const updateIndividualScenario = (productId: string, updates: Partial<ProductScenario>) => {
    setIndividualScenarios((prev) =>
      prev.map((scenario) => (scenario.productId === productId ? { ...scenario, ...updates } : scenario)),
    )
  }

  // Calcular custos fixos totais
  const totalFixedCosts = globalFixedCostsList
    .filter((cost) => cost.isActive)
    .reduce((total, cost) => total + cost.amount, 0)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cenários de Vendas</h2>
          <p className="text-muted-foreground">Nenhum produto cadastrado para simulação</p>
        </div>
      </div>
    )
  }

  // Calcular cenário para um produto específico
  const calculateProductScenario = (product: any, dailySales: number, priceMultiplier: number): Scenario => {
    const adjustedPrice = product.price * priceMultiplier
    const margin = adjustedPrice - product.cmv
    const monthlyRevenue = dailySales * adjustedPrice * 30
    const monthlyProfit = dailySales * margin * 30
    const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0

    let status: Scenario["status"] = "critical"
    if (profitMargin >= 25) status = "excellent"
    else if (profitMargin >= 15) status = "good"
    else if (profitMargin >= 5) status = "warning"

    return {
      id: `${product.id}-${dailySales}-${priceMultiplier}`,
      name: `${dailySales} vendas/dia`,
      dailySales,
      priceMultiplier,
      monthlyRevenue,
      monthlyProfit,
      profitMargin,
      status,
    }
  }

  // Calcular cenário consolidado (todos os produtos)
  const calculateConsolidatedScenario = (): Scenario => {
    let totalMonthlyRevenue = 0
    let totalMonthlyProfit = 0

    products.forEach((product) => {
      const scenario = individualScenarios.find((s) => s.productId === product.id)
      if (scenario) {
        const adjustedPrice = product.price * scenario.priceMultiplier
        const margin = adjustedPrice - product.cmv
        totalMonthlyRevenue += scenario.dailySales * adjustedPrice * 30
        totalMonthlyProfit += scenario.dailySales * margin * 30
      }
    })

    totalMonthlyProfit -= totalFixedCosts
    const profitMargin = totalMonthlyRevenue > 0 ? (totalMonthlyProfit / totalMonthlyRevenue) * 100 : 0

    let status: Scenario["status"] = "critical"
    if (profitMargin >= 25) status = "excellent"
    else if (profitMargin >= 15) status = "good"
    else if (profitMargin >= 5) status = "warning"

    return {
      id: "consolidated",
      name: "Cenário Consolidado",
      dailySales: 0,
      priceMultiplier: 0,
      monthlyRevenue: totalMonthlyRevenue,
      monthlyProfit: totalMonthlyProfit,
      profitMargin,
      status,
    }
  }

  const consolidatedScenario = calculateConsolidatedScenario()

  const getStatusColor = (status: Scenario["status"]) => {
    switch (status) {
      case "excellent":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "good":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20"
      case "warning":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20"
    }
  }

  const getStatusIcon = (status: Scenario["status"]) => {
    switch (status) {
      case "excellent":
        return <TrendingUp className="h-4 w-4" />
      case "good":
        return <TrendingUp className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "critical":
        return <TrendingDown className="h-4 w-4" />
    }
  }

  const getStatusText = (status: Scenario["status"]) => {
    switch (status) {
      case "excellent":
        return "Excelente"
      case "good":
        return "Bom"
      case "warning":
        return "Atenção"
      case "critical":
        return "Crítico"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Cenários de Vendas</h2>
        <p className="text-muted-foreground">Simule diferentes volumes de vendas e teste a sensibilidade de preços</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Seleção de Produtos
          </CardTitle>
          <CardDescription>Escolha os produtos para simulação e defina o modo de edição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedProducts.length === products.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="font-medium">
                  Selecionar Todos ({products.length} produtos)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isGlobalMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsGlobalMode(true)}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Global
                </Button>
                <Button
                  variant={!isGlobalMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsGlobalMode(false)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Individual
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={product.id}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                  />
                  <Label htmlFor={product.id} className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand} - R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>

            {selectedProducts.length > 0 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-600">
                  {selectedProducts.length} produto(s) selecionado(s) para simulação
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isGlobalMode && selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Controles Globais
            </CardTitle>
            <CardDescription>
              Aplique as mesmas configurações para todos os {selectedProducts.length} produtos selecionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Vendas por Dia: {globalScenario.dailySales}</Label>
                  <Slider
                    value={[globalScenario.dailySales]}
                    onValueChange={([value]) => setGlobalScenario((prev) => ({ ...prev, dailySales: value }))}
                    max={200}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Multiplicador de Preço: {(globalScenario.priceMultiplier * 100).toFixed(0)}%</Label>
                  <Slider
                    value={[globalScenario.priceMultiplier]}
                    onValueChange={([value]) => setGlobalScenario((prev) => ({ ...prev, priceMultiplier: value }))}
                    max={1.5}
                    min={0.7}
                    step={0.05}
                    className="mt-2"
                  />
                </div>
                <Button onClick={applyGlobalChanges} className="w-full">
                  Aplicar para Produtos Selecionados
                </Button>
              </div>
              <div className="lg:col-span-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Preview das Alterações</h4>
                  <div className="space-y-2">
                    {selectedProducts.slice(0, 3).map((productId) => {
                      const product = products.find((p) => p.id === productId)
                      if (!product) return null
                      return (
                        <div key={productId} className="flex justify-between text-sm">
                          <span>{product.name}</span>
                          <span>
                            {globalScenario.dailySales} vendas/dia × R${" "}
                            {(product.price * globalScenario.priceMultiplier).toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                    {selectedProducts.length > 3 && (
                      <p className="text-xs text-muted-foreground">... e mais {selectedProducts.length - 3} produtos</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cenário Consolidado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Resultado Consolidado
          </CardTitle>
          <CardDescription>Visão geral de todos os produtos com as configurações atuais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(consolidatedScenario.status)}>
                  {getStatusIcon(consolidatedScenario.status)}
                  {getStatusText(consolidatedScenario.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Status Geral</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">R$ {consolidatedScenario.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p
                className={`text-2xl font-bold ${consolidatedScenario.monthlyProfit > 0 ? "text-green-500" : "text-red-500"}`}
              >
                R$ {consolidatedScenario.monthlyProfit.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Lucro Mensal</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p
                className={`text-2xl font-bold ${consolidatedScenario.profitMargin > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {consolidatedScenario.profitMargin.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Margem de Lucro</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Simulação Individual por Produto
          </CardTitle>
          <CardDescription>Ajuste os parâmetros individualmente para cada produto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(selectedProducts.length > 0 ? products.filter((p) => selectedProducts.includes(p.id)) : products).map(
              (product) => {
                const scenario = individualScenarios.find((s) => s.productId === product.id) || {
                  productId: product.id,
                  dailySales: 50,
                  priceMultiplier: 1,
                }
                const calculatedScenario = calculateProductScenario(
                  product,
                  scenario.dailySales,
                  scenario.priceMultiplier,
                )

                return (
                  <div key={product.id} className="border rounded-lg p-4">
                    {isCalculating ? (
                      <LoadingSpinner />
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {product.brand} - R$ {product.price.toFixed(2)}
                          </p>

                          <div className="space-y-4">
                            <div>
                              <Label>Vendas por Dia: {scenario.dailySales}</Label>
                              <Slider
                                value={[scenario.dailySales]}
                                onValueChange={([value]) => updateIndividualScenario(product.id, { dailySales: value })}
                                max={200}
                                min={10}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Multiplicador de Preço: {(scenario.priceMultiplier * 100).toFixed(0)}%</Label>
                              <Slider
                                value={[scenario.priceMultiplier]}
                                onValueChange={([value]) =>
                                  updateIndividualScenario(product.id, { priceMultiplier: value })
                                }
                                max={1.5}
                                min={0.7}
                                step={0.05}
                                className="mt-2"
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Preço ajustado: R$ {(product.price * scenario.priceMultiplier).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge className={getStatusColor(calculatedScenario.status)}>
                                {getStatusIcon(calculatedScenario.status)}
                                {getStatusText(calculatedScenario.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                                <p className="text-lg font-semibold">
                                  R$ {calculatedScenario.monthlyRevenue.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Lucro Mensal</p>
                                <p
                                  className={`text-lg font-semibold ${calculatedScenario.monthlyProfit > 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                  R$ {calculatedScenario.monthlyProfit.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Margem de Lucro</p>
                                <p
                                  className={`text-lg font-semibold ${calculatedScenario.profitMargin > 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                  {calculatedScenario.profitMargin.toFixed(1)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Margem Unitária</p>
                                <p className="text-lg font-semibold text-blue-500">
                                  R$ {(product.price * scenario.priceMultiplier - product.cmv).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              },
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
