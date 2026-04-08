# ICP Lucky Draw

## Current State
The app is a casino-style ICP lottery. Key components:
- `useInternetIdentity.ts` - Auth hook managing Internet Identity login state
- `useQueries.ts` - React Query hooks for backend and ICP ledger interactions
- `Header.tsx` - Responsive nav with wallet dropdown and mobile drawer
- `HeroSection.tsx` - Jackpot display and buy ticket CTA
- `backend/main.mo` - Motoko lottery backend

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- **`useInternetIdentity.ts`** (critical bug fix): The `useEffect` that restores saved sessions has a `finally` block that unconditionally sets `loginStatus` to `"idle"` even after successfully finding and restoring an authenticated identity. This causes login state to be lost on every page refresh. Fix: remove the `finally` block's status setter and instead set `"success"` inside the `if (isAuthenticated)` branch and `"idle"` in the `else` branch.
- **`useInternetIdentity.ts`** (secondary bug): The `useEffect` depends on `authClient` state, which causes re-runs when `setAuthClient` is called inside the effect. Guard with a ref or use a separate initialization flag to prevent double-runs.

### Remove
- Nothing

## Implementation Plan
1. Fix `useInternetIdentity.ts`: In the `useEffect` async body, after `await existingClient.isAuthenticated()`, set `setStatus("success")` when `isAuthenticated` is true, and `setStatus("idle")` when false. Remove the `finally` block's `setStatus("idle")` call entirely (keep `finally` for cleanup only if needed, or remove it).
2. Validate and build frontend.
