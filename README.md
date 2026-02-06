# DAO Voting UI – On-Chain Governance Console

**DAO Voting UI** is a modern, open-source Web3 interface for **decentralized autonomous organization (DAO) governance**. Connect your wallet, browse on-chain proposals, cast votes, and create new proposals—all from a single Next.js application wired to Governor-compatible smart contracts.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org) [![Wagmi](https://img.shields.io/badge/Wagmi-3-8B5CF6)](https://wagmi.sh) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)

---

## What is DAO Voting UI?

DAO Voting UI is a **purpose-built governance console** for DAOs using **OpenZeppelin Governor-style** contracts on Ethereum (and compatible chains). It provides:

- **Proposal list & detail** – View all proposals with state, votes (for / against / abstain), and timelines
- **On-chain voting** – Cast votes directly from a connected wallet (MetaMask, Coinbase Wallet, etc.)
- **Create proposals** – Submit new governance proposals with targets, calldata, and descriptions
- **Voting power** – See your voting weight at proposal snapshot block
- **Single config** – Point the app at your Governor contract and chain via one config file

Built with **Next.js 16**, **Wagmi 3**, **viem**, **React Query**, and **Tailwind CSS** for a fast, type-safe, and maintainable stack.

---

## Features

| Feature | Description |
|--------|-------------|
| **Wallet connection** | Injected (MetaMask) and Coinbase Wallet; Wagmi handles state and chain switching |
| **Proposal discovery** | Fetches proposals from `ProposalCreated` events and enriches with state/votes |
| **Vote casting** | For / Against / Abstain with optional reason; uses `castVote` / `castVoteWithReason` |
| **Create proposal** | Form for targets, values, calldatas, and description; calls Governor `propose` |
| **Caching & refresh** | React Query caches on-chain reads; configurable stale time and refetch |
| **Responsive UI** | Tailwind-based layout; loading, empty, and error states per component |

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Web3:** [Wagmi 3](https://wagmi.sh) + [viem](https://viem.sh) for reads/writes and wallet connectivity
- **Data:** [TanStack React Query](https://tanstack.com/query/latest) for server state and caching
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **State:** [Zustand](https://github.com/pmndrs/zustand) (optional local state)
- **Language:** TypeScript 5

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** (or npm / yarn / bun)

### Install & run

```bash
# Clone the repository
git clone https://github.com/KuchikiRenji/dao-voting-ui.git
cd dao-voting-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Enter the console** to go to the DAO voting page.

### Build for production

```bash
pnpm build
pnpm start
```

---

## Configuration

Governor contract and network are configured in **one place**: `constants/governorConfig.ts`.

| Setting | Description |
|--------|-------------|
| `NETWORK` | Target chain (default: Sepolia); use any Wagmi chain |
| `GOVERNOR_ADDRESS` | Deployed Governor contract address |
| `GOVERNOR_ABI` | ABI with events/functions used by the app (ProposalCreated, state, proposalVotes, castVote, propose, etc.) |

Optional environment variable:

- `NEXT_PUBLIC_GOVERNOR_START_BLOCK` – Block number to start scanning for `ProposalCreated` (default: 0). Set to deployment block for large chains to speed up initial load.

After changing the config, restart the dev server. No other code changes are required.

---

## Project Structure (high level)

```
app/
  page.tsx              # Landing
  dao/
    page.tsx             # Proposal list + create form
    [id]/page.tsx        # Single proposal detail & voting
components/              # ProposalCard, ProposalDetail, VoteButtons, etc.
hooks/                   # useProposals, useProposal, useVote, useCreateProposal, …
lib/
  governance.ts          # Governor reads (getProposals, getProposal) via viem
  formatters.ts          # Title extraction, date formatting
constants/
  governorConfig.ts      # Network, address, ABI
providers/
  web3.tsx               # WagmiProvider + QueryClientProvider
```

For full data flow and hook responsibilities, see [docs/architecture.md](docs/architecture.md).

---

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |

---

## Author & Contact

**KuchikiRenji**

- **GitHub:** [github.com/KuchikiRenji](https://github.com/KuchikiRenji)
- **Email:** KuchikiRenji@outlook.com
- **Discord:** `kuchiki_renji`

---

## License

This project is private by default. See the repository for license terms.

---

## Keywords (for discoverability)

DAO · governance · voting · Ethereum · Web3 · Next.js · Wagmi · viem · Governor contract · decentralized · blockchain · React · TypeScript · Tailwind
