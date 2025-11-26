import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-10 px-6 py-16">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          DAO Toolkit
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">
          Operate your Governor from a purpose-built console.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          This UI is wired for Wagmi + viem, React Query, and Tailwind. Point it
          at your Governor contract, plug in Hardhat ABIs, and ship a production
          governance experience fast.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/dao"
          className="rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
        >
          Enter the console
        </Link>
        <a
          href="https://wagmi.sh"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-700 px-6 py-3 text-base font-semibold text-white transition hover:border-white/60"
        >
          Wagmi docs
        </a>
      </div>
    </main>
  );
}
