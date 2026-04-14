"use client";

import PageShell from "@/components/Base/PageShell";
import BuffettScorePanel from "@/components/momoia/BuffettScorePanel";

export default function MomoIA() {
  return (
    <PageShell align="center" density={28}>
      <div className="w-full py-10">
        <BuffettScorePanel />
      </div>
    </PageShell>
  );
}
