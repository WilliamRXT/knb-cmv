import { FinancialProvider } from "@/contexts/financial-context"
import { FinancialDashboard } from "@/components/financial-dashboard"

export default function Home() {
  return (
    <FinancialProvider>
      <FinancialDashboard />
    </FinancialProvider>
  )
}
