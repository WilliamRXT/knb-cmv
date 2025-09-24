"use client"

import type React from "react"

import { useState } from "react"
import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Trash2, Calculator } from "lucide-react"
import type { Ingredient } from "@/types/financial"

interface ProductFormProps {
  onClose: () => void
}

export function ProductForm({ onClose }: ProductFormProps) {
  const { brands, addProduct } = useFinancial()
  const [name, setName] = useState("")
  const [brandId, setBrandId] = useState("")
  const [price, setPrice] = useState("")
  const [ingredients, setIngredients] = useState<Omit<Ingredient, "id">[]>([])

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", cost: 0, unit: "" }])
  }

  const updateIngredient = (index: number, field: keyof Omit<Ingredient, "id">, value: string | number) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const calculateCMV = () => {
    return ingredients.reduce((total, ingredient) => total + ingredient.cost, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !brandId || !price || ingredients.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    addProduct({
      name,
      brandId,
      price: Number.parseFloat(price),
      ingredients: ingredients.map((ing) => ({
        ...ing,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      })),
    })

    onClose()
  }

  const selectedBrand = brands.find((b) => b.id === brandId)
  const cmv = calculateCMV()
  const margin = Number.parseFloat(price) > 0 ? ((Number.parseFloat(price) - cmv) / Number.parseFloat(price)) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Novo Produto</CardTitle>
            <CardDescription>Adicione um novo hambúrguer com ingredientes e custos</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Kebrada Clássico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Select value={brandId} onValueChange={setBrandId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                          {brand.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
              {selectedBrand?.fixedPrice && (
                <p className="text-sm text-muted-foreground">
                  Preço fixo da marca: R$ {selectedBrand.fixedPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Ingredientes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ingredientes *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ingrediente
                </Button>
              </div>

              {ingredients.map((ingredient, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        placeholder="Ex: Pão"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Custo (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={ingredient.cost}
                        onChange={(e) => updateIngredient(index, "cost", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unidade</Label>
                      <Input
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        placeholder="Ex: un, kg, g"
                        required
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {ingredients.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                  <Calculator className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Adicione ingredientes para calcular o CMV automaticamente</p>
                </div>
              )}
            </div>

            {/* Resumo do CMV */}
            {ingredients.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>CMV Total:</span>
                    <span className="font-medium">R$ {cmv.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço de Venda:</span>
                    <span className="font-medium">R$ {Number.parseFloat(price || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lucro Bruto:</span>
                    <span className="font-medium">R$ {(Number.parseFloat(price || "0") - cmv).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Margem de Lucro:</span>
                    <span className={margin > 0 ? "text-green-500" : "text-red-500"}>{margin.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Criar Produto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
