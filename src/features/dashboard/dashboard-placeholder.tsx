import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Atlas</CardTitle>
        <CardDescription>
          This workspace is a placeholder. Connect authentication, roles, and
          product modules before it becomes operational.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Learning systems, organization tools, and production workflows will
        appear here after approved access is wired to a signed-in account.
      </CardContent>
    </Card>
  );
}
