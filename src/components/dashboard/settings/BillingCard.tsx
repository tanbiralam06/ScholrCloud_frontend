import { Button } from "@/components/ui/button";

interface BillingCardProps {
  plan: string;
  status: string;
}

export function BillingCard({ plan, status }: BillingCardProps) {
  const planLabel = plan
    ? plan.charAt(0).toUpperCase() + plan.slice(1) + " Plan"
    : "Basic Plan";

  return (
    <div className="bg-card border rounded-xl p-6 space-y-4">
      <h3 className="font-semibold">Current Plan</h3>
      <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex-1">
          <p className="font-semibold text-lg">{planLabel}</p>
          <p className="text-sm text-muted-foreground">
            {plan === "pro"
              ? "Unlimited students · Advanced reports · Priority support"
              : plan === "enterprise"
              ? "Everything in Pro · Custom integrations · Dedicated support"
              : "Up to 500 students · Basic reports · Email support"}
          </p>
        </div>
        <Button variant="outline">Manage Subscription</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Status: <span className="font-medium capitalize">{status}</span>
      </p>
    </div>
  );
}
