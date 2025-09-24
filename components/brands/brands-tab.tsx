"use client"

import { useState } from "react"
import { Plus, Package, TrendingUp, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFinancial } from "@/contexts/financial-context"

export function BrandsTab() {
  const { brands } = useFinancial()
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  const mockBrands = [
    {
      id: "1",
      name: "Marca Premium",
      status: "active",
      products: 12,
      revenue: 45000,
      margin: 35,
      growth: 12.5,
    },
    {
      id: "2",
      name: "Marca Econômica",
      status: "active",
      products: 8,
      revenue: 28000,
      margin: 22,
      growth: 8.3,
    },
    {
      id: "3",
      name: "Marca Sazonal",
      status: "inactive",
      products: 5,
      revenue: 15000,
      margin: 18,
      growth: -2.1,
    },
  ]

  const activeBrands = mockBrands.filter((brand) => brand.status === "active")
  const totalRevenue = mockBrands.reduce((sum, brand) => sum + brand.revenue, 0)
  const avgMargin = mockBrands.reduce((sum, brand) => sum + brand.margin, 0) / mockBrands.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Marcas</h2>
          <p className="text-muted-foreground mt-2">Gerencie suas marcas e acompanhe o desempenho de cada uma</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Marca
        </Button>
      </div>

      {/* Métricas das Marcas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Marcas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBrands.length}</div>
            <p className="text-xs text-muted-foreground">{activeBrands.length} ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Todas as marcas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.9%</div>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBrands.map((brand) => (
          <Card key={brand.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <Badge variant={brand.status === "active" ? "default" : "secondary"}>
                  {brand.status === "active" ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <CardDescription>{brand.products} produtos cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Receita:</span>
                  <span className="font-medium">R$ {brand.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Margem:</span>
                  <span className="font-medium">{brand.margin}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Crescimento:</span>
                  <span className={`font-medium ${brand.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {brand.growth >= 0 ? "+" : ""}
                    {brand.growth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
