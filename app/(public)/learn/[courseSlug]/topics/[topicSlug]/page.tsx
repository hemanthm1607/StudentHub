import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface TopicsAliasProps {
  params: Promise<{
    courseSlug: string;
    topicSlug: string;
  }>;
}

export default async function TopicsAliasPage({ params }: TopicsAliasProps) {
  const { courseSlug, topicSlug } = await params;
  redirect(`/learn/${courseSlug}/${topicSlug}`);
}
