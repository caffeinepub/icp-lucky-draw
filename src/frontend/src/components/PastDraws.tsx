import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { usePastDraws } from "../hooks/useQueries";
import {
  formatIcp,
  formatWeekLabel,
  truncatePrincipal,
} from "../utils/lottery";

export function PastDraws() {
  const { data: draws, isLoading } = usePastDraws(20n);

  return (
    <section id="draws" className="relative z-10 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-cinzel text-2xl font-bold text-center mb-10 gold-gradient"
        >
          Recent Draws
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-casino rounded-xl overflow-hidden"
          data-ocid="draws.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(199,144,43,0.2), rgba(122,79,18,0.1))",
                    borderBottom: "1px solid #B88A2A",
                  }}
                >
                  <th
                    className="px-4 py-3 text-left font-cinzel text-xs tracking-widest uppercase"
                    style={{ color: "#F6D27A" }}
                  >
                    Draw
                  </th>
                  <th
                    className="px-4 py-3 text-left font-cinzel text-xs tracking-widest uppercase"
                    style={{ color: "#F6D27A" }}
                  >
                    Winner
                  </th>
                  <th
                    className="px-4 py-3 text-right font-cinzel text-xs tracking-widest uppercase"
                    style={{ color: "#F6D27A" }}
                  >
                    Prize (ICP)
                  </th>
                  <th
                    className="px-4 py-3 text-right font-cinzel text-xs tracking-widest uppercase"
                    style={{ color: "#F6D27A" }}
                  >
                    Tickets
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`skel-${i + 1}`}
                      style={{ borderBottom: "1px solid rgba(184,138,42,0.1)" }}
                    >
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </td>
                    </tr>
                  ))}
                {!isLoading && (!draws || draws.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center"
                      data-ocid="draws.empty_state"
                    >
                      <p
                        className="font-cinzel text-sm"
                        style={{ color: "oklch(0.60 0.02 300)" }}
                      >
                        🎰 No draws yet — be the first to play!
                      </p>
                    </td>
                  </tr>
                )}
                {draws?.map((draw, i) => (
                  <tr
                    key={`draw-${draw.year}-${draw.week}`}
                    style={{
                      borderBottom: "1px solid rgba(184,138,42,0.1)",
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(246,210,122,0.02)",
                    }}
                    className="transition-colors hover:bg-white/5"
                    data-ocid={`draws.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-cinzel text-xs"
                        style={{ color: "#F2EDF7" }}
                      >
                        {formatWeekLabel(draw.week, draw.year)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {draw.winner ? (
                        <span
                          className="font-mono text-xs"
                          style={{ color: "#4BB6FF" }}
                        >
                          {truncatePrincipal(draw.winner.toString())}
                        </span>
                      ) : (
                        <span
                          className="text-xs italic"
                          style={{ color: "oklch(0.60 0.02 300)" }}
                        >
                          No tickets sold
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="font-cinzel text-sm font-semibold"
                        style={{ color: "#FFD36A" }}
                      >
                        {formatIcp(draw.pot, 2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="font-cinzel text-xs"
                        style={{ color: "oklch(0.84 0.02 300)" }}
                      >
                        {Number(draw.tickets)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
