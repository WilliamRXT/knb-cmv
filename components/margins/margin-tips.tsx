"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, DollarSign, Target, AlertCircle } from "lucide-react"

export function MarginTips() {
  const tips = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: "Margem Ideal",
      description: "Para hambúrgueres, uma margem entre 60-70% é considerada excelente.",
      color: "border-green-500/20 bg-green-500/5",
    },
    {
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      title: "Reduza Custos",
      description: "Negocie com fornecedores, compre em maior quantidade ou encontre ingredientes alternativos.",
      color: "border-blue-500/20 bg-blue-500/5",
    },
    {
      icon: <Target className="h-5 w-5 text-purple-500" />,
      title: "Ajuste Preços",
      description: "Se a margem está baixa, considere aumentar o preço gradualmente ou criar combos.",
      color: "border-purple-500/20 bg-purple-500/5",
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      title: "Atenção aos Alertas",
      description: "Produtos com margem abaixo de 40% precisam de atenção imediata.",
      color: "border-yellow-500/20 bg-yellow-500/5",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Dicas para Melhorar sua Rentabilidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip, index) => (
            <div key={index} className={`p-4 rounded-lg border ${tip.color}`}>
              <div className="flex items-start gap-3">
                {tip.icon}
                <div>
                  <h4 className="font-semibold mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
