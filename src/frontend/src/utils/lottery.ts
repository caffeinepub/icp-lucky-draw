export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatWeekLabel(week: bigint, year: bigint): string {
  const w = Number(week);
  const y = Number(year);
  return `${getOrdinal(w)} Week of ${y}`;
}

export function e8sToIcp(e8s: bigint): number {
  return Number(e8s) / 100_000_000;
}

export function icpToE8s(icp: number): bigint {
  return BigInt(Math.round(icp * 100_000_000));
}

export function formatIcp(e8s: bigint, decimals = 4): string {
  return e8sToIcp(e8s).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getNextSundayDraw(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilSunday,
      23,
      59,
      0,
      0,
    ),
  );
  return next;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getCountdown(): CountdownParts {
  const now = Date.now();
  const target = getNextSundayDraw().getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export function getCurrentWeekYear(): { week: number; year: number } {
  const now = new Date();
  const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86400000,
  );
  const week = Math.ceil((dayOfYear + startOfYear.getUTCDay() + 1) / 7);
  return { week: Math.max(1, week), year: now.getUTCFullYear() };
}

export function truncatePrincipal(principal: string): string {
  if (principal.length <= 15) return principal;
  return `${principal.slice(0, 7)}...${principal.slice(-5)}`;
}
