import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DrawResult } from "../backend";
import { loadConfig } from "../config";
import { approveIcpSpend, getIcpBalance } from "../utils/icpLedger";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useCurrentRound() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["currentRound"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentRound();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useMyTickets() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myTickets"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getMyTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePastDraws(num: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<DrawResult[]>({
    queryKey: ["pastDraws", num.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPastDraws(num);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsLotteryAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isLotteryAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isLotteryAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTicketPrice() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ticketPrice"],
    queryFn: async () => {
      if (!actor) return 10_000_000n;
      return actor.getTicketPrice();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIcpBalance() {
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["icpBalance", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity || identity.getPrincipal().isAnonymous()) return 0n;
      const config = await loadConfig();
      return getIcpBalance(identity, config.backend_host);
    },
    enabled: !!identity && !identity.getPrincipal().isAnonymous(),
    refetchInterval: 30_000,
  });
}

export function useBuyTicket() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor || !identity) throw new Error("Not connected");
      // Get ticket price and backend canister ID
      const [ticketPrice, config] = await Promise.all([
        actor.getTicketPrice(),
        loadConfig(),
      ]);
      // Step 1: Approve ICP spend on the ICP ledger
      await approveIcpSpend(
        identity,
        config.backend_canister_id,
        ticketPrice,
        config.backend_host,
      );
      // Step 2: Buy ticket (backend calls transfer_from)
      return actor.buyTicket();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
      queryClient.invalidateQueries({ queryKey: ["currentRound"] });
      queryClient.invalidateQueries({ queryKey: ["icpBalance"] });
    },
  });
}

export function useAddToPot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amountE8s: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.addToPot(amountE8s);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentRound"] });
    },
  });
}

export function useTriggerDraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.triggerDraw();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentRound"] });
      queryClient.invalidateQueries({ queryKey: ["pastDraws"] });
    },
  });
}

export function useChangeTicketPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (priceE8s: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminChangeTicketPrice(priceE8s);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketPrice"] });
    },
  });
}

export function useChangeRound() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ year, week }: { year: bigint; week: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminChangeRound(year, week);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentRound"] });
    },
  });
}

export function useAdminSetup() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ year, week }: { year: bigint; week: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminSetup(year, week);
    },
  });
}

export function useSetupLotteryAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.setupLotteryAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isLotteryAdmin"] });
    },
  });
}

export function useSetAdminWallet() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (walletText: string) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      const wallet = Principal.fromText(walletText);
      return actor.setAdminWallet(wallet);
    },
  });
}
