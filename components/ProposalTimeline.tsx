'use client';

import type { GovernorState } from "@/lib/governance";
import { formatTimeRemaining } from "@/lib/formatters";

type Props = {
  state: GovernorState;
  startTimestamp?: number;
  endTimestamp?: number;
};

const STEPS: GovernorState[] = [
  "Pending",
  "Active",
  "Succeeded",
  "Queued",
  "Executed",
];

const FAILURE_STATES: GovernorState[] = ["Defeated", "Canceled", "Expired"];

export function ProposalTimeline({ state, startTimestamp, endTimestamp }: Props) {
  const currentIndex = STEPS.indexOf(state);
  const failed = FAILURE_STATES.includes(state);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
      <p className="text-sm font-semibold text-slate-200">Timeline</p>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
        {STEPS.map((step, index) => {
          const completed = currentIndex > index || (failed && index < 2);
          const isActive = currentIndex === index && !failed;

          return (
            <div
              key={step}
              className="flex flex-1 items-center gap-3 text-sm text-slate-400"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  completed
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                    : isActive
                      ? "border-white text-white"
                      : "border-slate-700 text-slate-500"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-white">{step}</p>
                {index === 0 && startTimestamp ? (
                  <p className="text-xs text-slate-400">
                    {new Date(startTimestamp * 1000).toLocaleString()}
                  </p>
                ) : null}
                {index === 1 && endTimestamp ? (
                  <p className="text-xs text-slate-400">
                    Ends {formatTimeRemaining(endTimestamp)}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {failed ? (
        <div className="mt-4 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-200">
          Proposal {state.toLowerCase()}
        </div>
      ) : null}
    </div>
  );
}


