"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingDown, DollarSign, Package, Users, Zap } from "lucide-react"

interface BreakevenTipsProps {
  currentBreakeven: number
  status: string
}

export function BreakevenTips({ currentBreakeven, status }: BreakevenTipsProps) {
  const tips = [
    {
      category: "Reduzir Custos Fixos",
      icon: TrendingDown,
      variant: "outline" as const,
      items: [
        "Renegociar aluguel com o proprietário",
        "Otimizar consumo de energia elétrica",
        "Revisar contratos de fornecedores",
        "Automatizar processos para reduzir mão de obra",
        "Consolidar fornecedores para obter descontos",
      ],
    },
    {
      category: "Aumentar Margem",
      icon: DollarSign,
      variant: "outline" as const,
      items: [
        "Ajustar preços dos produtos menos rentáveis",
        "Negociar melhores preços com fornecedores",
        "Criar combos com maior margem",
        "Focar na venda de produtos mais rentáveis",
        "Reduzir desperdício de ingredientes",
      ],
    },
    {
      category: "Otimizar Produtos",
      icon: Package,
      variant: "outline" as const,
      items: [
        "Revisar receitas para reduzir custos",
        "Padronizar porções para controlar CMV",
        "Substituir ingredientes por opções mais baratas",
        "Criar produtos sazonais com ingredientes em promoção",
        "Eliminar produtos com baixa margem",
      ],
    },
    {
      category: "Aumentar Eficiência",
      icon: Zap,
      variant: "outline" as const,
      items: [
        "Melhorar processo de produção",
        "Treinar equipe para reduzir desperdício",
        "Implementar controle de estoque",
        "Otimizar cardápio para ingredientes comuns",
        "Usar tecnologia para automatizar pedidos",
      ],
    },
  ]

  const getPriorityTips = () => {
    switch (status) {
      case "critical":
        return "Ação urgente necessária! Foque primeiro em reduzir custos fixos."
      case "warning":
        return "Considere implementar algumas melhorias para reduzir o ponto de equilíbrio."
      case "good":
        return "Situação controlada, mas sempre há espaço para otimização."
      default:
        return "Excelente! Mantenha o foco na eficiência operacional."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Dicas para Reduzir o Ponto de Equilíbrio
        </CardTitle>
        <CardDescription>{getPriorityTips()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((tip) => {
            const Icon = tip.icon
            return (
              <div key={tip.category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <Badge variant={tip.variant}>{tip.category}</Badge>
                </div>

                <ul className="space-y-2">
                  {tip.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Simulação de Impacto */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Simulação de Impacto
          </h4>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="text-center p-3 bg-background rounded">
              <div className="font-bold text-green-600">-R$ 500</div>
              <div className="text-muted-foreground">custos fixos</div>
              <div className="text-xs mt-1">= {Math.max(1, currentBreakeven - 3)} hambúrgueres/dia</div>
            </div>
            <div className="text-center p-3 bg-background rounded">
              <div className="font-bold text-blue-600">+R$ 2,00</div>
              <div className="text-muted-foreground">margem média</div>
              <div className="text-xs mt-1">= {Math.max(1, Math.ceil(currentBreakeven * 0.8))} hambúrgueres/dia</div>
            </div>
            <div className="text-center p-3 bg-background rounded">
              <div className="font-bold text-purple-600">Ambos</div>
              <div className="text-muted-foreground">combinados</div>
              <div className="text-xs mt-1">= {Math.max(1, Math.ceil(currentBreakeven * 0.6))} hambúrgueres/dia</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
