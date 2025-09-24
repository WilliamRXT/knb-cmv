"use client"

import { useState } from "react"
import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calculator, DollarSign } from "lucide-react"
import { ProductDetails } from "./product-details"
import { ProductEditForm } from "./product-edit-form"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import type { Product } from "@/types/financial"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { brands, deleteProduct } = useFinancial()
  const [showDetails, setShowDetails] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const brand = brands.find((b) => b.id === product.brandId)
  const margin = product.price > 0 ? ((product.price - product.cmv) / product.price) * 100 : 0
  const profit = product.price - product.cmv

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    deleteProduct(product.id)
    setShowDeleteConfirm(false)
  }

  const handleEdit = () => {
    setShowEditForm(true)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {brand && (
                  <>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                    {brand.name}
                  </>
                )}
              </CardDescription>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={handleEdit}
                title="Editar produto"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={handleDelete}
                title="Excluir produto"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                Preço
              </div>
              <div className="text-lg font-semibold">R$ {product.price.toFixed(2)}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calculator className="h-3 w-3" />
                CMV
              </div>
              <div className="text-lg font-semibold">R$ {product.cmv.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Lucro Bruto:</span>
              <span className={`font-medium ${profit > 0 ? "text-green-500" : "text-red-500"}`}>
                R$ {profit.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Margem:</span>
              <Badge variant={margin > 30 ? "default" : margin > 15 ? "secondary" : "destructive"}>
                {margin.toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {product.ingredients.length} ingrediente{product.ingredients.length !== 1 ? "s" : ""}
            </div>
            <div className="flex flex-wrap gap-1">
              {product.ingredients.slice(0, 3).map((ingredient) => (
                <Badge key={ingredient.id} variant="outline" className="text-xs">
                  {ingredient.name}
                </Badge>
              ))}
              {product.ingredients.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.ingredients.length - 3} mais
                </Badge>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowDetails(true)} className="w-full">
            Ver Detalhes
          </Button>
        </CardContent>
      </Card>

      {showDetails && <ProductDetails product={product} onClose={() => setShowDetails(false)} />}
      {showEditForm && <ProductEditForm product={product} onClose={() => setShowEditForm(false)} />}

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </>
  )
}
