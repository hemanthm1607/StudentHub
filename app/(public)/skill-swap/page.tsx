import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Users2, Repeat, CalendarCheck, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Skill Swap Architecture — StudentHub",
  description: "Peer-to-peer knowledge exchange matching students based on skills they can teach and skills they want to learn.",
};

export default function SkillSwapPage() {
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <Container size="lg">
        <PageHeader
          title="Skill Swap Exchange"
          description="Peer-to-peer learning network: teach what you already know and learn what you don't."
          badge={<Badge variant="info">Peer Learning Engine (Phase 8 Foundation)</Badge>}
        />

        <Alert variant="info" className="mb-8" title="Deterministic Matching Blueprint (Phase 8)">
          Skill Swap uses a deterministic matching algorithm factoring in teaching skills, target learning topics, language preferences, and timezone overlap. It runs efficiently at $0 cost on PostgreSQL without requiring heavy AI or paid matching services.
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
                <Repeat className="w-5 h-5" />
              </div>
              <CardTitle>Deterministic Match</CardTitle>
              <CardDescription>
                Calculates reciprocal teach/learn compatibility using normalized database queries in sub-20ms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <CardTitle>Direct Peer Chat</CardTitle>
              <CardDescription>
                Lightweight real-time messaging using Server-Sent Events (SSE) with HTTP/2 and zero Redis dependency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-2">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <CardTitle>Session Scheduler</CardTitle>
              <CardDescription>
                Coordinate study sessions with defined agendas, mutual calendar confirmation, and peer feedback.
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
