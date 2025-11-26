import Link from "next/link";

import { ProposalList } from "@/components/ProposalList";
import { CreateProposalForm } from "@/components/CreateProposalForm";

export const dynamic = "force-dynamic";

export default function DaoPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-emerald-300">
          Governance
        </p>
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold text-white">
              DAO Voting Console
            </h1>
            <p className="mt-2 text-base text-slate-300">
              Inspect proposals, review on-chain signal, and vote directly from
              your wallet.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-white/60"
          >
            Back home
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Proposals</h2>
          <Link
            href="#create"
            className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/30"
          >
            Create proposal
          </Link>
        </div>
        <ProposalList />
      </section>

      <CreateProposalForm />
    </div>
  );
}

