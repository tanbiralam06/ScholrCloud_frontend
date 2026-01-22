import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <Button>Collect Fee</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Collected</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">₹0</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Amount</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">₹0</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">₹0</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest fee transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">No payment records found.</div>
        </CardContent>
      </Card>
    </div>
  );
}
