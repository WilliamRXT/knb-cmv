export interface Brand {
  id: string
  name: string
  type: "popular" | "premium"
  fixedPrice?: number
  status: "active" | "inactive"
  color: string
}

export interface Ingredient {
  id: string
  name: string
  cost: number
  unit: string
}

export interface Product {
  id: string
  name: string
  brandId: string
  price: number
  ingredients: Ingredient[]
  cmv: number
}

export interface CostCategory {
  id: string
  name: string
  description: string
  icon: string
}

export interface GlobalFixedCost {
  id: string
  categoryId: string
  name: string
  amount: number
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GlobalFixedCosts {
  rent: number
  utilities: number
  employees: number
  marketing: number
  other: number
}

export interface FinancialMetrics {
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  profitMargin: number
  breakEvenPoint: number
}
