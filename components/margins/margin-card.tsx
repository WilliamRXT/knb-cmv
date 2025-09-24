"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import type { Product } from "@/types/financial"

interface MarginCardProps {
  product: Product
  profit: number
  margin: number
  marginStatus: {
    status: string
    color: string
    text: string
  }
  brandColor: string
}

export function MarginCard({ product, profit, margin, marginStatus, brandColor }: MarginCardProps) {
  const getIcon = () => {
    switch (marginStatus.status) {
      case "excellent":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "good":
        return <TrendingUp className="h-5 w-5 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "danger":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getAdvice = () => {
    switch (marginStatus.status) {
      case "excellent":
        return "Parabéns! Margem excelente."
      case "good":
        return "Boa margem de lucro."
      case "warning":
        return "Considere revisar os custos."
      case "danger":
        return "Urgente: revisar preços ou custos!"
      default:
        return ""
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: brandColor }} />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {product.name}
          {getIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Preço de Venda</p>
            <p className="font-semibold text-lg">R$ {product.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Custo (CMV)</p>
            <p className="font-semibold text-lg">R$ {product.cmv.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground">Você ganha por hambúrguer:</p>
            <Badge className={`${marginStatus.color} text-white font-semibold`}>{marginStatus.text}</Badge>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">R$ {profit.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{margin.toFixed(1)}% de margem</p>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm font-medium text-center">{getAdvice()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
