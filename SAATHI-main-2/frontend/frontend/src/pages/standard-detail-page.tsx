import { StandardDetail } from "@/components/standards/standard-detail";

interface StandardDetailPageProps {
  standardKey: string;
  initialTab?: string;
}

// Public, same as StandardsBrowserPage: no login/role gate.
export function StandardDetailPage({
  standardKey,
  initialTab,
}: StandardDetailPageProps) {
  return <StandardDetail standardKey={standardKey} initialTab={initialTab} />;
}
