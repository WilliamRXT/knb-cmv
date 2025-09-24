import { createClient } from "@/lib/supabase/client"
import type { Brand, Product, GlobalFixedCost, CostCategory, Ingredient, FinancialMetrics } from "@/types/financial"

const supabase = createClient()

// Brands
export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase.from("brands").select("*").order("name")

  if (error) {
    console.error("Error fetching brands:", error)
    return []
  }

  return data.map((brand) => ({
    id: brand.id,
    name: brand.name,
    type: brand.type as "popular" | "premium",
    fixedPrice: brand.fixed_price,
    status: brand.status as "active" | "inactive",
    color: brand.color,
  }))
}

export async function createBrand(brand: Omit<Brand, "id">): Promise<Brand | null> {
  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: brand.name,
      type: brand.type,
      fixed_price: brand.fixedPrice,
      status: brand.status,
      color: brand.color,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating brand:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    fixedPrice: data.fixed_price,
    status: data.status,
    color: data.color,
  }
}

export async function updateBrand(brand: Brand): Promise<Brand | null> {
  const { data, error } = await supabase
    .from("brands")
    .update({
      name: brand.name,
      type: brand.type,
      fixed_price: brand.fixedPrice,
      status: brand.status,
      color: brand.color,
    })
    .eq("id", brand.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating brand:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    fixedPrice: data.fixed_price,
    status: data.status,
    color: data.color,
  }
}

// Products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      ingredients (*)
    `)
    .order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    brandId: product.brand_id,
    price: product.price,
    cmv: product.cmv,
    ingredients: product.ingredients.map((ing: any) => ({
      id: ing.id,
      name: ing.name,
      cost: ing.cost,
      unit: ing.unit,
    })),
  }))
}

export async function createProduct(product: Omit<Product, "id" | "cmv">): Promise<Product | null> {
  const cmv = product.ingredients.reduce((total, ingredient) => total + ingredient.cost, 0)

  const { data: productData, error: productError } = await supabase
    .from("products")
    .insert({
      name: product.name,
      brand_id: product.brandId,
      price: product.price,
      cmv,
    })
    .select()
    .single()

  if (productError) {
    console.error("Error creating product:", productError)
    return null
  }

  // Inserir ingredientes
  const ingredientsData = product.ingredients.map((ingredient) => ({
    product_id: productData.id,
    name: ingredient.name,
    cost: ingredient.cost,
    unit: ingredient.unit,
  }))

  const { data: ingredientsResult, error: ingredientsError } = await supabase
    .from("ingredients")
    .insert(ingredientsData)
    .select()

  if (ingredientsError) {
    console.error("Error creating ingredients:", ingredientsError)
    // Rollback: deletar o produto criado
    await supabase.from("products").delete().eq("id", productData.id)
    return null
  }

  return {
    id: productData.id,
    name: productData.name,
    brandId: productData.brand_id,
    price: productData.price,
    cmv: productData.cmv,
    ingredients: ingredientsResult.map((ing) => ({
      id: ing.id,
      name: ing.name,
      cost: ing.cost,
      unit: ing.unit,
    })),
  }
}

export async function updateProduct(product: Product): Promise<Product | null> {
  const cmv = product.ingredients.reduce((total, ingredient) => total + ingredient.cost, 0)

  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      brand_id: product.brandId,
      price: product.price,
      cmv,
    })
    .eq("id", product.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating product:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    brandId: data.brand_id,
    price: data.price,
    cmv: data.cmv,
    ingredients: product.ingredients,
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return false
  }

  return true
}

// Ingredients
export async function createIngredient(
  productId: string,
  ingredient: Omit<Ingredient, "id">,
): Promise<Ingredient | null> {
  const { data, error } = await supabase
    .from("ingredients")
    .insert({
      product_id: productId,
      name: ingredient.name,
      cost: ingredient.cost,
      unit: ingredient.unit,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating ingredient:", error)
    return null
  }

  // Atualizar CMV do produto
  await updateProductCMV(productId)

  return {
    id: data.id,
    name: data.name,
    cost: data.cost,
    unit: data.unit,
  }
}

export async function updateIngredient(ingredient: Ingredient, productId: string): Promise<Ingredient | null> {
  const { data, error } = await supabase
    .from("ingredients")
    .update({
      name: ingredient.name,
      cost: ingredient.cost,
      unit: ingredient.unit,
    })
    .eq("id", ingredient.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating ingredient:", error)
    return null
  }

  // Atualizar CMV do produto
  await updateProductCMV(productId)

  return {
    id: data.id,
    name: data.name,
    cost: data.cost,
    unit: data.unit,
  }
}

export async function deleteIngredient(ingredientId: string, productId: string): Promise<boolean> {
  const { error } = await supabase.from("ingredients").delete().eq("id", ingredientId)

  if (error) {
    console.error("Error deleting ingredient:", error)
    return false
  }

  // Atualizar CMV do produto
  await updateProductCMV(productId)
  return true
}

async function updateProductCMV(productId: string): Promise<void> {
  const { data: ingredients, error } = await supabase.from("ingredients").select("cost").eq("product_id", productId)

  if (error) {
    console.error("Error fetching ingredients for CMV update:", error)
    return
  }

  const cmv = ingredients.reduce((total, ingredient) => total + ingredient.cost, 0)

  await supabase.from("products").update({ cmv }).eq("id", productId)
}

// Cost Categories
export async function getCostCategories(): Promise<CostCategory[]> {
  const { data, error } = await supabase.from("cost_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching cost categories:", error)
    return []
  }

  return data
}

// Global Fixed Costs
export async function getGlobalFixedCosts(): Promise<GlobalFixedCost[]> {
  const { data, error } = await supabase.from("global_fixed_costs").select("*").order("name")

  if (error) {
    console.error("Error fetching global fixed costs:", error)
    return []
  }

  return data.map((cost) => ({
    id: cost.id,
    categoryId: cost.category_id,
    name: cost.name,
    amount: cost.amount,
    description: cost.description,
    isActive: cost.is_active,
    createdAt: new Date(cost.created_at),
    updatedAt: new Date(cost.updated_at),
  }))
}

export async function createGlobalFixedCost(
  cost: Omit<GlobalFixedCost, "id" | "createdAt" | "updatedAt">,
): Promise<GlobalFixedCost | null> {
  const { data, error } = await supabase
    .from("global_fixed_costs")
    .insert({
      category_id: cost.categoryId,
      name: cost.name,
      amount: cost.amount,
      description: cost.description,
      is_active: cost.isActive,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating global fixed cost:", error)
    return null
  }

  return {
    id: data.id,
    categoryId: data.category_id,
    name: data.name,
    amount: data.amount,
    description: data.description,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export async function updateGlobalFixedCost(cost: GlobalFixedCost): Promise<GlobalFixedCost | null> {
  const { data, error } = await supabase
    .from("global_fixed_costs")
    .update({
      category_id: cost.categoryId,
      name: cost.name,
      amount: cost.amount,
      description: cost.description,
      is_active: cost.isActive,
    })
    .eq("id", cost.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating global fixed cost:", error)
    return null
  }

  return {
    id: data.id,
    categoryId: data.category_id,
    name: data.name,
    amount: data.amount,
    description: data.description,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export async function deleteGlobalFixedCost(id: string): Promise<boolean> {
  const { error } = await supabase.from("global_fixed_costs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting global fixed cost:", error)
    return false
  }

  return true
}

// Financial Metrics
export async function getLatestFinancialMetrics(): Promise<FinancialMetrics | null> {
  const { data, error } = await supabase
    .from("financial_metrics")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching financial metrics:", error)
    return null
  }

  return {
    totalRevenue: data.total_revenue,
    totalCosts: data.total_costs,
    totalProfit: data.total_profit,
    profitMargin: data.profit_margin,
    breakEvenPoint: data.break_even_point,
  }
}

export async function saveFinancialMetrics(metrics: FinancialMetrics): Promise<boolean> {
  const { error } = await supabase.from("financial_metrics").insert({
    total_revenue: metrics.totalRevenue,
    total_costs: metrics.totalCosts,
    total_profit: metrics.totalProfit,
    profit_margin: metrics.profitMargin,
    break_even_point: metrics.breakEvenPoint,
  })

  if (error) {
    console.error("Error saving financial metrics:", error)
    return false
  }

  return true
}
