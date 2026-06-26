import { MetricGrid } from "@/components/overview/MetricGrid";
import { HealthScoreCard } from "@/components/overview/HealthScoreCard";
import { ExpenseBarCard } from "@/components/overview/ExpenseBarCard";
import { ActionBanner } from "@/components/overview/ActionBanner";
import { StrengthsRisksList } from "@/components/overview/StrengthsRisksList";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <MetricGrid />
      <div className="grid grid-cols-2 gap-3">
        <HealthScoreCard />
        <ExpenseBarCard />
      </div>
      <ActionBanner />
      <StrengthsRisksList />
    </div>
  );
}
