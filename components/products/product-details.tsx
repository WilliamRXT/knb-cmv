"use client"

import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Calculator, DollarSign, TrendingUp, Package } from "lucide-react"
import type { Product } from "@/types/financial"

interface ProductDetailsProps {
  product: Product
  onClose: () => void
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const { brands } = useFinancial()

  const brand = brands.find((b) => b.id === product.brandId)
  const margin = product.price > 0 ? ((product.price - product.cmv) / product.price) * 100 : 0
  const profit = product.price - product.cmv

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              {brand && (
                <>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                  {brand.name} • {brand.type === "popular" ? "Popular" : "Premium"}
                </>
              )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preço de Venda</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {product.price.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CMV Total</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {product.cmv.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lucro Bruto</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${profit > 0 ? "text-green-500" : "text-red-500"}`}>
                  R$ {profit.toFixed(2)}
                </div>
                <Badge variant={margin > 30 ? "default" : margin > 15 ? "secondary" : "destructive"} className="mt-1">
                  {margin.toFixed(1)}% margem
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Ingredientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ingredientes ({product.ingredients.length})
              </CardTitle>
              <CardDescription>Composição detalhada do produto e custos individuais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{ingredient.name}</div>
                      <div className="text-sm text-muted-foreground">Unidade: {ingredient.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R$ {ingredient.cost.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {((ingredient.cost / product.cmv) * 100).toFixed(1)}% do CMV
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise de Rentabilidade */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Rentabilidade</CardTitle>
              <CardDescription>Métricas importantes para tomada de decisão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Custo por Real de Venda</div>
                  <div className="text-lg font-semibold">R$ {(product.cmv / product.price).toFixed(2)}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Markup</div>
                  <div className="text-lg font-semibold">{((product.price / product.cmv) * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Classificação da Margem</div>
                <div className="flex items-center gap-2">
                  {margin > 40 && <Badge className="bg-green-500">Excelente (&gt;40%)</Badge>}
                  {margin > 25 && margin <= 40 && <Badge className="bg-blue-500">Boa (25-40%)</Badge>}
                  {margin > 15 && margin <= 25 && <Badge variant="secondary">Regular (15-25%)</Badge>}
                  {margin <= 15 && <Badge variant="destructive">Baixa (≤15%)</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
