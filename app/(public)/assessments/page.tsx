import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Clock, Shuffle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Assessments & Integrity — StudentHub",
  description: "Summative assessment engine with honest proctoring boundaries, timed sessions, and sealed solutions.",
};

export default function AssessmentsPage() {
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <Container size="lg">
        <PageHeader
          title="Assessments & Integrity Engine"
          description="High-integrity formal evaluations combining conceptual questions, code prediction, and coding tasks."
          badge={<Badge variant="info">Evaluation Engine (Phase 7 Foundation)</Badge>}
        />

        <Alert variant="info" className="mb-8" title="Practical Integrity Notice (Phase 7)">
          StudentHub prioritizes practical assessment integrity controls: strictly enforced server-side countdown windows, randomized question variants, and sealed test solutions. We maintain honest academic transparency by acknowledging the inherent boundaries of web browsers rather than claiming unverified proctoring guarantees.
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <CardTitle>Server-Side Timing</CardTitle>
              <CardDescription>
                Attempts are governed by tamper-proof backend timestamps, preventing client-side timer manipulation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2">
                <Shuffle className="w-5 h-5" />
              </div>
              <CardTitle>Randomized Variants</CardTitle>
              <CardDescription>
                Dynamic question selection from pool matrices to prevent identical test sequence distribution.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle>Sealed Explanations</CardTitle>
              <CardDescription>
                Correct answers and hidden test criteria remain sealed until the testing window concludes.
              </CardDescription>
            </CardHeader>
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
