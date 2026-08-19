import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Atlas</CardTitle>
          <CardDescription>
            One workspace for learning systems and production workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Use the sidebar to open Learning or Production. Detailed
            demonstrations stay behind approved access.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/learning">Open Learning</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/production">Open Production</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
