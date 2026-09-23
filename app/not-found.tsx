import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 bg-white min-h-[60vh] flex items-center justify-center">
      <Container size="sm" className="text-center space-y-4">
        <span className="text-4xl font-extrabold text-blue-600 font-mono">404</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          The curriculum lesson, practice problem, or page you requested could not be located or may have moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="sm" leftIcon={<Home className="w-3.5 h-3.5" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              View Courses
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
