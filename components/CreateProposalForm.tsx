'use client';

import { FormEvent, useState } from "react";
import { clsx } from "clsx";

import { useCreateProposal } from "@/hooks/useCreateProposal";

type ActionField = {
  target: `0x${string}` | "";
  calldata: `0x${string}` | "";
};

export function CreateProposalForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [action, setAction] = useState<ActionField>({
    target: "",
    calldata: "0x",
  });
  const { createProposal, isCreating, error, txHash } = useCreateProposal();
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!action.target || !action.calldata) {
      setFormError("Provide target and calldata");
      return;
    }
    if (!title || !description) {
      setFormError("Title and description are required");
      return;
    }
    setFormError(null);

    const composedDescription = `# ${title}\n\n${description}`;

    try {
      await createProposal({
        targets: [action.target],
        values: [0n],
        calldatas: [action.calldata],
        description: composedDescription,
      });
      setTitle("");
      setDescription("");
      setAction({ target: "", calldata: "0x" });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form
      id="create"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
    >
      <h2 className="text-xl font-semibold text-white">Create proposal</h2>
      <p className="mt-1 text-sm text-slate-400">
        Provide metadata plus target & calldata for a single action. Extend the
        form for more complex proposals.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
            placeholder="Treasury diversification"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
            placeholder="Explain rationale, success criteria…"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Target (contract)
            </span>
            <input
              type="text"
              value={action.target}
              onChange={(event) =>
                setAction((prev) => ({
                  ...prev,
                  target: event.target.value as `0x${string}` | "",
                }))
              }
              placeholder="0x..."
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Calldata</span>
            <input
              type="text"
              value={action.calldata}
              onChange={(event) =>
                setAction((prev) => ({
                  ...prev,
                  calldata: event.target.value as `0x${string}` | "",
                }))
              }
              placeholder="0x00"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {formError ? (
        <p className="mt-3 text-sm text-rose-300">{formError}</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      {txHash ? (
        <p className="mt-3 text-sm text-emerald-300">
          Tx: {txHash.slice(0, 8)}…{txHash.slice(-6)}
        </p>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className={clsx(
            "rounded-full px-6 py-3 text-sm font-semibold",
            isCreating
              ? "bg-slate-700 text-slate-300"
              : "bg-emerald-500 text-slate-900 hover:bg-emerald-400",
          )}
          disabled={isCreating}
        >
          {isCreating ? "Submitting…" : "Submit proposal"}
        </button>
      </div>
    </form>
  );
}


