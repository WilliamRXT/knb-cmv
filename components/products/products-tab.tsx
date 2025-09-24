"use client"

import { useState } from "react"
import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, DollarSign, TrendingUp, Calculator } from "lucide-react"
import { ProductForm } from "./product-form"
import { ProductCard } from "./product-card"
import { LoadingSpinner } from "../loading-spinner"

export function ProductsTab() {
  const { brands, products, isLoading } = useFinancial()
  const [showForm, setShowForm] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string>("all")

  const filteredProducts =
    selectedBrand === "all" ? products : products.filter((product) => product.brandId === selectedBrand)

  const totalProducts = products.length
  const averageCMV = products.length > 0 ? products.reduce((sum, product) => sum + product.cmv, 0) / products.length : 0
  const averagePrice =
    products.length > 0 ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0
  const averageMargin = averagePrice > 0 ? ((averagePrice - averageCMV) / averagePrice) * 100 : 0

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos & CMV</h1>
          <p className="text-muted-foreground">Gerencie hambúrgueres, ingredientes e calcule o CMV automaticamente</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Métricas dos Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CMV Médio</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageCMV.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Custo médio dos produtos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Preço médio de venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Margem de lucro média</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros por Marca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Marca</CardTitle>
          <CardDescription>Visualize produtos por marca específica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedBrand === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBrand("all")}
            >
              Todas as Marcas
            </Button>
            {brands.map((brand) => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBrand(brand.id)}
                className="gap-2"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                {brand.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {selectedBrand === "all"
                ? "Comece adicionando seu primeiro produto"
                : "Não há produtos para a marca selecionada"}
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
        )}
      </div>

      {/* Modal do Formulário */}
      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
