"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type {
  Brand,
  Product,
  GlobalFixedCosts,
  FinancialMetrics,
  GlobalFixedCost,
  CostCategory,
  Ingredient,
} from "@/types/financial"
import * as db from "@/lib/database"

interface FinancialContextType {
  brands: Brand[]
  products: Product[]
  globalFixedCosts: GlobalFixedCosts
  globalFixedCostsList: GlobalFixedCost[]
  costCategories: CostCategory[]
  metrics: FinancialMetrics
  isLoading: boolean
  updateBrand: (brand: Brand) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  updateGlobalFixedCosts: (costs: GlobalFixedCosts) => void
  addGlobalFixedCost: (cost: Omit<GlobalFixedCost, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateGlobalFixedCost: (cost: GlobalFixedCost) => Promise<void>
  deleteGlobalFixedCost: (id: string) => Promise<void>
  addProduct: (product: Omit<Product, "id" | "cmv">) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addIngredient: (productId: string, ingredient: Omit<Ingredient, "id">) => Promise<void>
  updateIngredient: (productId: string, ingredient: Ingredient) => Promise<void>
  deleteIngredient: (productId: string, ingredientId: string) => Promise<void>
  refreshData: () => Promise<void>
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

const initialGlobalFixedCosts: GlobalFixedCosts = {
  rent: 3500,
  utilities: 800,
  employees: 6000,
  marketing: 1200,
  other: 500,
}

const initialMetrics: FinancialMetrics = {
  totalRevenue: 45000,
  totalCosts: 32000,
  totalProfit: 13000,
  profitMargin: 28.9,
  breakEvenPoint: 850,
}

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [globalFixedCosts, setGlobalFixedCosts] = useState<GlobalFixedCosts>(initialGlobalFixedCosts)
  const [globalFixedCostsList, setGlobalFixedCostsList] = useState<GlobalFixedCost[]>([])
  const [costCategories, setCostCategories] = useState<CostCategory[]>([])
  const [metrics, setMetrics] = useState<FinancialMetrics>(initialMetrics)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [brandsData, productsData, costCategoriesData, globalFixedCostsData, metricsData] = await Promise.all([
        db.getBrands(),
        db.getProducts(),
        db.getCostCategories(),
        db.getGlobalFixedCosts(),
        db.getLatestFinancialMetrics(),
      ])

      setBrands(brandsData)
      setProducts(productsData)
      setCostCategories(costCategoriesData)
      setGlobalFixedCostsList(globalFixedCostsData)

      if (metricsData) {
        setMetrics(metricsData)
      }

      // Calcular custos fixos globais agregados
      const aggregatedCosts = globalFixedCostsData.reduce(
        (acc, cost) => {
          if (!cost.isActive) return acc

          switch (cost.categoryId) {
            case "rent":
              acc.rent += cost.amount
              break
            case "utilities":
              acc.utilities += cost.amount
              break
            case "employees":
              acc.employees += cost.amount
              break
            case "marketing":
              acc.marketing += cost.amount
              break
            default:
              acc.other += cost.amount
          }
          return acc
        },
        { rent: 0, utilities: 0, employees: 0, marketing: 0, other: 0 },
      )

      setGlobalFixedCosts(aggregatedCosts)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const refreshData = async () => {
    await loadData()
  }

  const updateBrand = async (brand: Brand) => {
    const updatedBrand = await db.updateBrand(brand)
    if (updatedBrand) {
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? updatedBrand : b)))
    }
  }

  const updateProduct = async (product: Product) => {
    const updatedProduct = await db.updateProduct(product)
    if (updatedProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...updatedProduct, ingredients: product.ingredients } : p)),
      )
    }
  }

  const addProduct = async (product: Omit<Product, "id" | "cmv">) => {
    const newProduct = await db.createProduct(product)
    if (newProduct) {
      setProducts((prev) => [...prev, newProduct])
    }
  }

  const deleteProduct = async (id: string) => {
    const success = await db.deleteProduct(id)
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const addIngredient = async (productId: string, ingredient: Omit<Ingredient, "id">) => {
    const newIngredient = await db.createIngredient(productId, ingredient)
    if (newIngredient) {
      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            const updatedIngredients = [...product.ingredients, newIngredient]
            const cmv = updatedIngredients.reduce((total, ing) => total + ing.cost, 0)
            return {
              ...product,
              ingredients: updatedIngredients,
              cmv,
            }
          }
          return product
        }),
      )
    }
  }

  const updateIngredient = async (productId: string, ingredient: Ingredient) => {
    const updatedIngredient = await db.updateIngredient(ingredient, productId)
    if (updatedIngredient) {
      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            const updatedIngredients = product.ingredients.map((ing) =>
              ing.id === ingredient.id ? updatedIngredient : ing,
            )
            const cmv = updatedIngredients.reduce((total, ing) => total + ing.cost, 0)
            return {
              ...product,
              ingredients: updatedIngredients,
              cmv,
            }
          }
          return product
        }),
      )
    }
  }

  const deleteIngredient = async (productId: string, ingredientId: string) => {
    const success = await db.deleteIngredient(ingredientId, productId)
    if (success) {
      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            const updatedIngredients = product.ingredients.filter((ing) => ing.id !== ingredientId)
            const cmv = updatedIngredients.reduce((total, ing) => total + ing.cost, 0)
            return {
              ...product,
              ingredients: updatedIngredients,
              cmv,
            }
          }
          return product
        }),
      )
    }
  }

  const updateGlobalFixedCosts = (costs: GlobalFixedCosts) => {
    setGlobalFixedCosts(costs)
  }

  const addGlobalFixedCost = async (cost: Omit<GlobalFixedCost, "id" | "createdAt" | "updatedAt">) => {
    const newCost = await db.createGlobalFixedCost(cost)
    if (newCost) {
      setGlobalFixedCostsList((prev) => [...prev, newCost])
      await refreshData() // Recarregar para atualizar custos agregados
    }
  }

  const updateGlobalFixedCost = async (cost: GlobalFixedCost) => {
    const updatedCost = await db.updateGlobalFixedCost(cost)
    if (updatedCost) {
      setGlobalFixedCostsList((prev) => prev.map((c) => (c.id === cost.id ? updatedCost : c)))
      await refreshData() // Recarregar para atualizar custos agregados
    }
  }

  const deleteGlobalFixedCost = async (id: string) => {
    const success = await db.deleteGlobalFixedCost(id)
    if (success) {
      setGlobalFixedCostsList((prev) => prev.filter((c) => c.id !== id))
      await refreshData() // Recarregar para atualizar custos agregados
    }
  }

  return (
    <FinancialContext.Provider
      value={{
        brands,
        products,
        globalFixedCosts,
        globalFixedCostsList,
        costCategories,
        metrics,
        isLoading,
        updateBrand,
        updateProduct,
        updateGlobalFixedCosts,
        addGlobalFixedCost,
        updateGlobalFixedCost,
        deleteGlobalFixedCost,
        addProduct,
        deleteProduct,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        refreshData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}
