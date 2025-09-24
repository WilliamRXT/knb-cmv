"use client"

import { useFinancial } from "@/contexts/financial-context"
import { MarginCard } from "./margin-card"
import { MarginTips } from "./margin-tips"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MarginsTab() {
  const { products, brands } = useFinancial()

  const getMarginStatus = (margin: number) => {
    if (margin >= 60) return { status: "excellent", color: "bg-green-500", text: "Excelente" }
    if (margin >= 40) return { status: "good", color: "bg-green-400", text: "Bom" }
    if (margin >= 20) return { status: "warning", color: "bg-yellow-500", text: "Atenção" }
    return { status: "danger", color: "bg-red-500", text: "Crítico" }
  }

  const productsByBrand = brands.map((brand) => ({
    brand,
    products: products.filter((product) => product.brandId === brand.id),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quanto você ganha em cada hambúrguer</h1>
        <p className="text-muted-foreground mt-2">
          Veja de forma simples e clara o lucro de cada produto das suas marcas
        </p>
      </div>

      {productsByBrand.map(({ brand, products: brandProducts }) => (
        <div key={brand.id} className="space-y-4">
          <Card className="border-l-4" style={{ borderLeftColor: brand.color }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl" style={{ color: brand.color }}>
                  {brand.name}
                </CardTitle>
                <Badge variant="outline" style={{ borderColor: brand.color, color: brand.color }}>
                  {brand.type === "popular" ? "Preço Fixo" : "Premium"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {brandProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum produto cadastrado para esta marca</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {brandProducts.map((product) => {
                    const profit = product.price - product.cmv
                    const margin = (profit / product.price) * 100
                    const marginStatus = getMarginStatus(margin)

                    return (
                      <MarginCard
                        key={product.id}
                        product={product}
                        profit={profit}
                        margin={margin}
                        marginStatus={marginStatus}
                        brandColor={brand.color}
                      />
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}

      <MarginTips />
    </div>
  )
}
