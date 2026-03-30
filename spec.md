# ICP Lucky Draw

## Current State
A lottery app where users buy tickets and an admin manages draws. Backend has `buyTicket()` with no actual ICP transfer. Admin panel is hidden because of a chicken-and-egg bug (only shows after isAdmin=true, but admin is only set by calling adminSetup which only runs when isAdmin=true). No ICP balance is shown after connecting.

## Requested Changes (Diff)

### Add
- Real ICP transfer via ICRC-2 in `buyTicket()`: frontend approves spend on ICP ledger, backend calls `icrc2_transfer_from`
- `setupLotteryAdmin()` backend function: first caller becomes lottery admin (stable, persists upgrades)
- `isLotteryAdmin()` query: returns if caller is lottery admin  
- `getTicketPrice()` query: returns ticket price in e8s
- `setAdminWallet(principal)` admin function: stores admin 5% wallet address
- `getAdminWallet()` query: returns admin wallet principal
- `icpLedger.ts` utility: wraps ICRC-1 balance query and ICRC-2 approve calls to ICP mainnet ledger
- ICP balance display in Header after wallet connect
- `useIcpBalance` hook, `useSetupLotteryAdmin` hook, `useIsLotteryAdmin` hook, `useSetAdminWallet` hook, `useTicketPrice` hook

### Modify
- `adminSetup()`: no longer traps for non-admin callers; if no admin exists sets first caller; if admin already set and caller IS admin updates year/week; else does nothing
- `buyTicket()`: calls ICP ledger `icrc2_transfer_from` before recording ticket
- `App.tsx`: remove `isAdmin &&` condition on adminSetup, call `setupLotteryAdmin` on every connect
- Admin panel gated by `isLotteryAdmin` (not `isCallerAdmin`)
- `useBuyTicket`: approve ICP spend before calling buyTicket
- AdminPanel wallet save wired to `setAdminWallet`

### Remove
- Nothing removed

## Implementation Plan
1. Rewrite `main.mo` with ICRC-2 ledger integration, stable admin vars, new query/update functions
2. Update `backend.did.js`, `backend.did.d.ts`, `backend.d.ts`, `backend.ts` with new methods
3. Create `icpLedger.ts` with balance and approve utilities
4. Update `useQueries.ts` with new hooks and updated `useBuyTicket`
5. Fix `App.tsx` admin setup flow
6. Add ICP balance to `Header.tsx`
7. Wire wallet save in `AdminPanel.tsx`
