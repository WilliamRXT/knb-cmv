"use client"

import { useState } from "react"
import { useFinancial } from "@/contexts/financial-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, EyeOff } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export function CostsList() {
  const { globalFixedCostsList, costCategories, updateGlobalFixedCost, deleteGlobalFixedCost } = useFinancial()
  const [filter, setFilter] = useState<string>("all")
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; costId: string; costName: string }>({
    open: false,
    costId: "",
    costName: "",
  })

  const filteredCosts = globalFixedCostsList.filter((cost) => {
    if (filter === "all") return true
    if (filter === "active") return cost.isActive
    if (filter === "inactive") return !cost.isActive
    return cost.categoryId === filter
  })

  const getCategoryInfo = (categoryId: string) => {
    return costCategories.find((cat) => cat.id === categoryId)
  }

  const toggleCostStatus = (cost: any) => {
    updateGlobalFixedCost({
      ...cost,
      isActive: !cost.isActive,
    })
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ open: true, costId: id, costName: name })
  }

  const confirmDelete = () => {
    deleteGlobalFixedCost(deleteConfirm.costId)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Custos</CardTitle>
          <CardDescription>Gerencie todos os custos fixos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Todos
            </Button>
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
              Ativos
            </Button>
            <Button
              variant={filter === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("inactive")}
            >
              Inativos
            </Button>
          </div>

          {/* Costs List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCosts.map((cost) => {
              const category = getCategoryInfo(cost.categoryId)
              return (
                <div key={cost.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category?.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cost.name}</span>
                        <Badge variant={cost.isActive ? "default" : "secondary"}>
                          {cost.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category?.name} • R$ {cost.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      {cost.description && <p className="text-xs text-muted-foreground mt-1">{cost.description}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCostStatus(cost)}
                      title={cost.isActive ? "Desativar" : "Ativar"}
                    >
                      {cost.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cost.id, cost.name)} title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {filteredCosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum custo encontrado</p>
                <p className="text-sm">Adicione novos custos para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Excluir Custo"
        description={`Tem certeza que deseja excluir o custo "${deleteConfirm.costName}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </>
  )
}
