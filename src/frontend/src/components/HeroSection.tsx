import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBuyTicket,
  useCurrentRound,
  useMyTickets,
} from "../hooks/useQueries";
import {
  type CountdownParts,
  formatIcp,
  formatWeekLabel,
  getCountdown,
} from "../utils/lottery";

const MAX_TICKETS = 10;

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 flex items-center justify-center rounded-lg font-cinzel text-2xl font-bold"
        style={{
          background: "oklch(0.10 0.04 295)",
          border: "1px solid #B88A2A",
          color: "#FFD36A",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className="text-xs mt-1 font-cinzel tracking-widest"
        style={{ color: "oklch(0.60 0.02 300)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function HeroSection() {
  const { identity, loginStatus } = useInternetIdentity();
  const isConnected = loginStatus === "success" && !!identity;
  const { data: round } = useCurrentRound();
  const { data: myTickets = 0n } = useMyTickets();
  const buyTicket = useBuyTicket();
  const [countdown, setCountdown] = useState<CountdownParts>(getCountdown());

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  const weekLabel = round
    ? formatWeekLabel(round[1], round[0])
    : "Current Week";
  const potE8s = round ? round[2] : 0n;
  const ticketCount = round ? round[3] : 0n;

  const canBuy =
    isConnected && Number(myTickets) < MAX_TICKETS && !buyTicket.isPending;

  async function handleBuy() {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      await buyTicket.mutateAsync();
      toast.success("🎟️ Ticket purchased! Good luck!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to buy ticket");
    }
  }

  return (
    <section id="play" className="relative z-10 pt-16 pb-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Week label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="font-cinzel text-sm tracking-widest uppercase mb-2"
            style={{ color: "#C7902B" }}
          >
            🎰 {weekLabel}
          </p>
          <h2
            className="font-cinzel-deco text-xl md:text-2xl mb-6"
            style={{ color: "oklch(0.84 0.02 300)" }}
          >
            Jackpot Counter
          </h2>
        </motion.div>

        {/* Big pot number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-2"
        >
          <div className="font-cinzel font-black text-5xl md:text-7xl jackpot-glow gold-gradient leading-tight">
            {formatIcp(potE8s, 2)} ICP
          </div>
          <p
            className="font-cinzel text-base mt-2"
            style={{ color: "#C7902B" }}
          >
            ✨ Current Grand Prize!
          </p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.60 0.02 300)" }}>
            {Number(ticketCount)} ticket{Number(ticketCount) !== 1 ? "s" : ""}{" "}
            sold
          </p>
        </motion.div>

        <div className="gold-divider my-8" />

        {/* CTA + Countdown row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Buy button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={handleBuy}
              disabled={!canBuy}
              className="btn-gold px-10 py-4 rounded-xl text-lg pulse-gold"
              data-ocid="play.primary_button"
            >
              {buyTicket.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Buying...
                </span>
              ) : (
                "🎟️ BUY TICKET NOW!"
              )}
            </button>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-cinzel" style={{ color: "#C7902B" }}>
                Entry: 0.1 ICP per ticket
              </p>
              {isConnected && (
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Your tickets: {Number(myTickets)} / {MAX_TICKETS}
                </p>
              )}
              {!isConnected && (
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Connect wallet to buy tickets
                </p>
              )}
              {isConnected && Number(myTickets) >= MAX_TICKETS && (
                <p className="text-xs" style={{ color: "#C61E1E" }}>
                  Max tickets reached
                </p>
              )}
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <p
              className="font-cinzel text-xs tracking-widest uppercase"
              style={{ color: "oklch(0.60 0.02 300)" }}
            >
              Next Draw In
            </p>
            <div className="flex items-center gap-2">
              <CountdownBox value={countdown.days} label="DAYS" />
              <span
                className="text-2xl font-bold mb-4"
                style={{ color: "#FFD36A" }}
              >
                :
              </span>
              <CountdownBox value={countdown.hours} label="HRS" />
              <span
                className="text-2xl font-bold mb-4"
                style={{ color: "#FFD36A" }}
              >
                :
              </span>
              <CountdownBox value={countdown.minutes} label="MIN" />
              <span
                className="text-2xl font-bold mb-4"
                style={{ color: "#FFD36A" }}
              >
                :
              </span>
              <CountdownBox value={countdown.seconds} label="SEC" />
            </div>
            <p
              className="text-xs font-cinzel"
              style={{ color: "oklch(0.60 0.02 300)" }}
            >
              Every Sunday at 11:59 PM UTC
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
