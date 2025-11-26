import { Suspense } from "react";

import { ProposalDetail } from "@/components/ProposalDetail";

type Props = {
  params: { id: string };
};

export default function ProposalPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-2xl border border-slate-900/60 bg-slate-900/30" />
        }
      >
        <ProposalDetail proposalId={params.id} />
      </Suspense>
    </div>
  );
}


