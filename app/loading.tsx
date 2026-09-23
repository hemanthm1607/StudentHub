import { Container } from "@/components/ui/Container";
import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="py-20 min-h-[50vh] flex items-center justify-center">
      <Container size="sm">
        <LoadingState message="Loading StudentHub curriculum and workspace..." />
      </Container>
    </div>
  );
}
