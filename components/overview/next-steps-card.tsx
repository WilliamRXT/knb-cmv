"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertTriangle, TrendingUp, Settings } from "lucide-react"

export function NextStepsCard() {
  const suggestions = [
    {
      title: "Revisar CMV dos Produtos",
      description: "Alguns produtos estão com margem abaixo do ideal",
      priority: "high",
      icon: AlertTriangle,
      action: "Revisar Agora",
    },
    {
      title: "Otimizar Custos Fixos",
      description: "Identificar oportunidades de redução de custos",
      priority: "medium",
      icon: TrendingUp,
      action: "Analisar",
    },
    {
      title: "Configurar Metas Mensais",
      description: "Definir objetivos de vendas e margem",
      priority: "low",
      icon: Settings,
      action: "Configurar",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos Passos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Icon className={`h-5 w-5 mt-0.5 ${getPriorityColor(suggestion.priority)}`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                {suggestion.action}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
