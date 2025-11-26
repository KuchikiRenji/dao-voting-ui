import { formatDistanceToNowStrict } from "date-fns";

export function formatAddress(address?: string, chars = 4) {
  if (!address) return "—";
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function extractTitleFromDescription(description: string) {
  if (!description) return "Untitled proposal";
  const [firstLine] = description.trim().split("\n");
  return firstLine.replace(/^#\s*/, "").trim() || "Untitled proposal";
}

export function formatVotes(value?: bigint | null, decimals = 18) {
  if (value === undefined || value === null) return "0";
  if (value === 0n) return "0";
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  if (whole === 0n) {
    return Number(value) / Number(divisor) < 0.01
      ? "<0.01"
      : (Number(value) / Number(divisor)).toFixed(2);
  }
  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");
  return fractionStr.length ? `${whole}.${fractionStr.slice(0, 4)}` : `${whole}`;
}

export function formatPercent(
  numerator: bigint,
  denominator: bigint,
  precision = 1,
) {
  if (denominator === 0n) return "0%";
  const percent =
    (Number(numerator) / Number(denominator)) * 100;
  return `${percent.toFixed(precision)}%`;
}

export function formatTimeRemaining(timestamp?: number) {
  if (!timestamp) return "—";
  const nowMs = Date.now();
  const targetMs = timestamp * 1000;
  const diff = targetMs - nowMs;
  if (diff <= 0) return "Ended";
  return formatDistanceToNowStrict(targetMs, { addSuffix: true });
}

export function toNumber(bn?: bigint) {
  return bn ? Number(bn) : 0;
}

