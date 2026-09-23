import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Code2, ShieldAlert, Cpu, CheckSquare } from "lucide-react";

export const metadata = {
  title: "Coding Practice Architecture — StudentHub",
  description: "Explore the secure isolated runner architecture designed for StudentHub coding workouts.",
};

export default function PracticePage() {
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <Container size="lg">
        <PageHeader
          title="Coding Practice Platform"
          description="Isolated code evaluation engine designed to run student code safely without risking the web host."
          badge={<Badge variant="warning">Sandboxed Runner (Phase 6 Foundation)</Badge>}
        />

        <Alert variant="info" className="mb-8" title="Security & Architecture Notice (Phase 6 Specification)">
          In accordance with the Phase 0 Security Directive, untrusted student code is <strong>never executed on the web application server</strong>. Practice execution will be isolated inside containerized workers with strict cgroups v2 resource quotas, 128MB RAM caps, 2s CPU limits, and no network access.
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
                <Code2 className="w-5 h-5" />
              </div>
              <CardTitle>Monaco Code Editor</CardTitle>
              <CardDescription>
                Full VS Code editing engine with syntax highlighting, indentation, and key bindings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-slate-500">Scheduled for integration in Phase 6.</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <CheckSquare className="w-5 h-5" />
              </div>
              <CardTitle>Dual-Stage Verification</CardTitle>
              <CardDescription>
                Visible test cases for real-time iterative debugging; hidden test cases for authoritative grading.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-slate-500">Scheduled for integration in Phase 6.</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-2">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <CardTitle>Air-Gapped Isolation</CardTitle>
              <CardDescription>
                Zero host network access, read-only root filesystems, and temporary memory mounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-slate-500">Scheduled for deployment in Phase 6.</span>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
