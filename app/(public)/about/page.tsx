import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Shield, DollarSign, Cpu, GraduationCap, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About StudentHub — Free Peer Learning Platform",
  description: "Learn about the mission, $0 operating cost philosophy, and technical architecture of StudentHub.",
};

export default function AboutPage() {
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <Container size="lg">
        <PageHeader
          title="About StudentHub"
          description="A free, student-centric academic and peer learning platform designed with zero commercial bloat."
          badge={<Badge variant="success">Architecture & Mission</Badge>}
        />

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                StudentHub was created to solve a persistent educational challenge: college students and independent learners are constantly confronted by paywalled courses, superficial 5-minute tutorials, fake credential programs, and bloated interfaces.
              </p>
              <p>
                Our core journey — <strong>LEARN → PRACTICE → TEST → IMPROVE → TEACH → LEARN FROM OTHERS</strong> — treats education as a rigorous, iterative discipline where learning theory, practical programming, and peer-to-peer mentorship reinforce each other.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <CardTitle>Zero Operating-Cost Philosophy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  To guarantee that StudentHub remains permanently free for students, our software architecture is deliberately built without expensive SaaS dependencies:
                </p>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                  <li>Zero paid Redis clusters: We use efficient database queries and SSE streams.</li>
                  <li>Zero paid authentication SaaS: Native secure JWT and argon2id sessions.</li>
                  <li>Zero AI dependency: The core platform functions 100% without AI quotas.</li>
                  <li>PostgreSQL on free/open-source tiers.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <CardTitle>Clean Modern Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  We prioritize modern, battle-tested software engineering standards:
                </p>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                  <li><strong>Next.js App Router</strong> with TypeScript strict type checking.</li>
                  <li><strong>Tailwind CSS</strong> for a crisp, white-first design system.</li>
                  <li><strong>Prisma ORM</strong> with normalized PostgreSQL schemas.</li>
                  <li><strong>Zod</strong> runtime schema validation on all inputs.</li>
                  <li><strong>Monaco Editor</strong> for true IDE-grade coding workouts.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4">
            <Link href="/learn">
              <Button size="lg">Explore Course Syllabus</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
