import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export const Announcement = () => (
  <Badge asChild variant="secondary">
    <Link href="/docs/components/base/signature-pad">
      <span className="flex size-2 rounded-full bg-blue-500" title="New" />
      New Signature Pad component <ArrowRightIcon />
    </Link>
  </Badge>
);
