import type { PublicClient } from "viem";

import { GOVERNOR_ABI, GOVERNOR_ADDRESS } from "@/constants/governorConfig";
import { extractTitleFromDescription } from "@/lib/formatters";

const PROPOSAL_CREATED_EVENT = GOVERNOR_ABI.find(
  (item) => item.type === "event" && item.name === "ProposalCreated",
);

if (!PROPOSAL_CREATED_EVENT) {
  throw new Error("Governor ABI must include ProposalCreated event");
}

const DEFAULT_DEPLOY_BLOCK =
  BigInt(process.env.NEXT_PUBLIC_GOVERNOR_START_BLOCK ?? 0);

export const GOVERNOR_STATES = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
] as const;

export type GovernorState = (typeof GOVERNOR_STATES)[number] | "Unknown";

export type VoteBreakdown = {
  for: bigint;
  against: bigint;
  abstain: bigint;
};

export type GovernorProposal = {
  id: bigint;
  proposer: `0x${string}`;
  title: string;
  description: string;
  startBlock: bigint;
  endBlock: bigint;
  snapshotBlock: bigint;
  deadlineBlock: bigint;
  startTimestamp?: number;
  endTimestamp?: number;
  state: GovernorState;
  votes: VoteBreakdown;
};

export function decodeState(value: bigint) {
  const code = Number(value);
  return GOVERNOR_STATES[code] ?? ("Unknown" as GovernorState);
}

async function safeBlockTimestamp(client: PublicClient, blockNumber: bigint) {
  try {
    const block = await client.getBlock({ blockNumber });
    return Number(block.timestamp);
  } catch {
    return undefined;
  }
}

/**
 * Fetches all proposals emitted by the Governor contract.
 */
type ProposalLog =
  Awaited<ReturnType<PublicClient["getLogs"]>> extends readonly (infer Item)[]
    ? Item
    : never;

async function buildProposalFromLog(
  client: PublicClient,
  log: ProposalLog,
): Promise<GovernorProposal> {
  const args = log.args!;
  const proposalId = args.proposalId as bigint;
  const description = String(args.description ?? "");
  const [stateRaw, votes, snapshotBlock, deadlineBlock] = await Promise.all([
    client.readContract({
      abi: GOVERNOR_ABI,
      address: GOVERNOR_ADDRESS,
      functionName: "state",
      args: [proposalId],
    }),
    client.readContract({
      abi: GOVERNOR_ABI,
      address: GOVERNOR_ADDRESS,
      functionName: "proposalVotes",
      args: [proposalId],
    }),
    client.readContract({
      abi: GOVERNOR_ABI,
      address: GOVERNOR_ADDRESS,
      functionName: "proposalSnapshot",
      args: [proposalId],
    }),
    client.readContract({
      abi: GOVERNOR_ABI,
      address: GOVERNOR_ADDRESS,
      functionName: "proposalDeadline",
      args: [proposalId],
    }),
  ]);

  const [startTimestamp, endTimestamp] = await Promise.all([
    safeBlockTimestamp(client, snapshotBlock as bigint),
    safeBlockTimestamp(client, deadlineBlock as bigint),
  ]);

  const {
    againstVotes,
    forVotes,
    abstainVotes,
  } = votes as {
    againstVotes: bigint;
    forVotes: bigint;
    abstainVotes: bigint;
  };

  return {
    id: proposalId,
    proposer: args.proposer as `0x${string}`,
    title: extractTitleFromDescription(description),
    description,
    startBlock: args.startBlock as bigint,
    endBlock: args.endBlock as bigint,
    snapshotBlock: snapshotBlock as bigint,
    deadlineBlock: deadlineBlock as bigint,
    startTimestamp,
    endTimestamp,
    state: decodeState(BigInt(stateRaw)),
    votes: {
      against: againstVotes,
      for: forVotes,
      abstain: abstainVotes,
    },
  };
}

export async function getProposals(client: PublicClient) {
  const logs = await client.getLogs({
    address: GOVERNOR_ADDRESS,
    event: PROPOSAL_CREATED_EVENT,
    fromBlock: DEFAULT_DEPLOY_BLOCK > 0n ? DEFAULT_DEPLOY_BLOCK : 0n,
    toBlock: "latest",
  });

  const proposals = await Promise.all(
    logs.map((log) => buildProposalFromLog(client, log as ProposalLog)),
  );

  return proposals.sort((a, b) => (a.id === b.id ? 0 : a.id > b.id ? -1 : 1));
}

export async function getProposal(client: PublicClient, proposalId: bigint) {
  const [log] = await client.getLogs({
    address: GOVERNOR_ADDRESS,
    event: PROPOSAL_CREATED_EVENT,
    args: { proposalId },
    fromBlock: DEFAULT_DEPLOY_BLOCK > 0n ? DEFAULT_DEPLOY_BLOCK : 0n,
    toBlock: "latest",
  });

  if (!log) return undefined;
  return buildProposalFromLog(client, log as ProposalLog);
}

