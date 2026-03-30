import { motion } from "motion/react";

export function HowItWorks() {
  const steps = [
    {
      icon: "🔗",
      title: "Connect Wallet",
      desc: "Link your Internet Identity wallet to participate in the draw.",
    },
    {
      icon: "🎟️",
      title: "Buy Tickets",
      desc: "Purchase up to 10 tickets per draw. Each ticket costs 0.1 ICP.",
    },
    {
      icon: "⏰",
      title: "Wait for Sunday",
      desc: "Every Sunday at 11:59 PM UTC, a winner is automatically selected.",
    },
    {
      icon: "🏆",
      title: "Win Big!",
      desc: "One lucky winner takes 90% of the jackpot pot!",
    },
  ];

  const potBreakdown = [
    {
      pct: "90%",
      label: "Lucky Winner",
      desc: "Straight to your wallet!",
      color: "#FFD36A",
      icon: "🏆",
    },
    {
      pct: "5%",
      label: "Next Draw Pool",
      desc: "Rolls over to boost next week's jackpot",
      color: "#4BB6FF",
      icon: "🔄",
    },
    {
      pct: "5%",
      label: "Website Maintenance",
      desc: "Keeps the platform running 24/7",
      color: "#C7902B",
      icon: "⚙️",
    },
  ];

  return (
    <section id="how" className="relative z-10 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-cinzel text-2xl font-bold text-center mb-10 gold-gradient"
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-casino rounded-xl p-6"
          >
            <h3 className="font-cinzel text-lg font-bold mb-5 gold-gradient">
              How to Play
            </h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{
                      background: "linear-gradient(135deg, #F6D27A, #C7902B)",
                      color: "#0B0710",
                      fontWeight: "900",
                      fontFamily: "Cinzel, serif",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p
                      className="font-cinzel text-sm font-semibold"
                      style={{ color: "#F6D27A" }}
                    >
                      {step.icon} {step.title}
                    </p>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "oklch(0.60 0.02 300)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-5 p-3 rounded-lg text-xs"
              style={{
                background: "oklch(0.08 0.03 295)",
                border: "1px solid rgba(184,138,42,0.3)",
              }}
            >
              <p style={{ color: "oklch(0.60 0.02 300)" }}>
                ⚠️ Maximum{" "}
                <strong style={{ color: "#F6D27A" }}>10 tickets</strong> per
                person per draw. Draw is fully automatic — results are announced
                every Sunday.
              </p>
            </div>
          </motion.div>

          {/* Pot Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-casino rounded-xl p-6"
          >
            <h3 className="font-cinzel text-lg font-bold mb-5 gold-gradient">
              Pot Distribution
            </h3>
            <div className="space-y-4">
              {potBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "oklch(0.08 0.03 295)" }}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="font-cinzel text-sm font-semibold"
                        style={{ color: "#F2EDF7" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="font-cinzel text-xl font-black"
                        style={{ color: item.color }}
                      >
                        {item.pct}
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.60 0.02 300)" }}
                    >
                      {item.desc}
                    </p>
                    <div
                      className="mt-2 h-1.5 rounded-full"
                      style={{ background: "oklch(0.15 0.03 295)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: item.pct,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="mt-4 text-xs text-center font-cinzel"
              style={{ color: "oklch(0.60 0.02 300)" }}
            >
              All distributions happen automatically on-chain via smart contract
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
