import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { FloatingDecorations } from "./components/FloatingDecorations";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { HowItWorks } from "./components/HowItWorks";
import { PastDraws } from "./components/PastDraws";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAdminSetup,
  useIsLotteryAdmin,
  useSetupLotteryAdmin,
} from "./hooks/useQueries";
import { getCurrentWeekYear } from "./utils/lottery";

export default function App() {
  const { loginStatus, identity } = useInternetIdentity();
  const isConnected = loginStatus === "success" && !!identity;
  const { data: isAdmin } = useIsLotteryAdmin();
  const adminSetup = useAdminSetup();
  const setupLotteryAdmin = useSetupLotteryAdmin();
  const setupCalled = useRef(false);

  const runSetup = useCallback(() => {
    const { week, year } = getCurrentWeekYear();
    // Try to register as lottery admin (only first caller succeeds)
    setupLotteryAdmin.mutateAsync().catch(() => {});
    // Initialize round year/week (only updates if not already set)
    adminSetup
      .mutateAsync({ year: BigInt(year), week: BigInt(week) })
      .catch(() => {});
  }, [setupLotteryAdmin, adminSetup]);

  // Run setup on every new wallet connection
  useEffect(() => {
    if (isConnected && !setupCalled.current) {
      setupCalled.current = true;
      runSetup();
    }
  }, [isConnected, runSetup]);

  // Reset flag when disconnected
  useEffect(() => {
    if (!isConnected) {
      setupCalled.current = false;
    }
  }, [isConnected]);

  function scrollToSection(id: string) {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top center, oklch(0.09 0.04 295) 0%, oklch(0.05 0.02 295) 50%, oklch(0.04 0.01 295) 100%)",
      }}
    >
      <FloatingDecorations />

      <Header isAdmin={!!isAdmin} onNavClick={scrollToSection} />

      <main className="relative z-10">
        <HeroSection />

        <div className="gold-divider mx-8" />

        <HowItWorks />

        <div className="gold-divider mx-8" />

        <PastDraws />

        {isAdmin && (
          <>
            <div className="gold-divider mx-8" />
            <AdminPanel />
          </>
        )}
      </main>

      <Footer />
      <Toaster
        toastOptions={{
          style: {
            background: "oklch(0.10 0.04 295)",
            border: "1px solid #B88A2A",
            color: "#F2EDF7",
            fontFamily: "Cinzel, serif",
          },
        }}
      />
    </div>
  );
}
