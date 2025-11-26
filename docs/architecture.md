# DAO Voting UI – Architecture Guide

## Data Flow

1. **Providers**
   - `Web3Provider` composes `WagmiProvider` + `QueryClientProvider`.
   - Wagmi supplies wallet connectivity, viem public client access, and chain context.
   - React Query manages caching + background refresh for on-chain reads.

2. **Hooks**
   - Hooks fire viem reads via the shared public client. Successful reads hydrate React Query caches keyed by chain id and entity id.
   - Components subscribe to those caches (`useProposals`, `useProposal`, etc.) which keeps UI reactive.

3. **Components**
   - Pages are server components that render client components (`ProposalList`, `ProposalDetail`, `CreateProposalForm`).
   - Client components execute hooks, render loading/error states, and trigger mutations (votes / proposals).

```
WagmiProvider + QueryClient
        │
 usePublicClient ----> governance lib (read contracts) ----> UI
        │
 useWriteContract ----> on-chain mutations ----> optimistic states
```

## Hooks Overview

| Hook | Responsibility |
| --- | --- |
| `useProposals` | Fetch and cache every proposal via ProposalCreated logs. |
| `useProposal` | Fetch a single proposal detail for `/dao/[id]`. |
| `useProposalState` | Lightweight polling for state changes without refetching all metadata. |
| `useVotingPower` | Reads `getVotes` for the connected wallet. |
| `useVote` | Wraps `castVote`, exposes semantic helpers (`voteFor`, etc.). |
| `useCreateProposal` | Wraps `propose`, handles tx + receipt states. |

All hooks accept ids / args, resolve Wagmi's public client, then delegate encoding + parsing to `lib/governance`.

## Contract Interaction Strategy

- **Reads** use viem `client.readContract` and `client.getLogs` inside the governance library. This centralizes ABI usage and enables memoizable, typed helpers.
- **Writes** use Wagmi's `useWriteContract` with pending + confirmation states surfaced to components. We wait for receipts through `useWaitForTransactionReceipt`.
- **Config** lives in `constants/governorConfig.ts` (address, ABI, target chain). Swap networks by editing one file.

## Component Tree (High Level)

```
app/layout.tsx
└── Web3Provider
    ├── app/page.tsx (Landing)
    └── app/dao/page.tsx
        ├── ProposalList
        │   └── ProposalCard
        └── CreateProposalForm

app/dao/[id]/page.tsx
└── ProposalDetail
    ├── VoteStats
    ├── VoteButtons
    └── ProposalTimeline
```

Each component handles its own loading/empty/error visuals and avoids side effects. Tailwind drives layout, while hooks concentrate logic for maintainability.


