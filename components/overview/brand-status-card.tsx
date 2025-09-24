"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinancial } from "@/contexts/financial-context"

export function BrandStatusCard() {
  const { brands, isLoading } = useFinancial()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status das Marcas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded mb-1" />
                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </>
        ) : (
          brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                <div>
                  <h4 className="font-medium">{brand.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {brand.type} {brand.fixedPrice && `• R$ ${brand.fixedPrice.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <Badge variant={brand.status === "active" ? "default" : "secondary"}>
                {brand.status === "active" ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
