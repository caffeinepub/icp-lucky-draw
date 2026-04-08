import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronDown,
  Copy,
  Loader2,
  LogOut,
  Menu,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIcpBalance } from "../hooks/useQueries";
import { e8sToIcp, truncatePrincipal } from "../utils/lottery";

interface HeaderProps {
  isAdmin: boolean;
  onNavClick: (section: string) => void;
}

function setGold(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "#F6D27A";
}
function unsetGold(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.color = "oklch(0.84 0.02 300)";
}

export function Header({ isAdmin, onNavClick }: HeaderProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: icpBalance } = useIcpBalance();
  const isLoggingIn = loginStatus === "logging-in";
  const isConnected = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";

  const navLinks = [
    { id: "play", label: "Play" },
    { id: "how", label: "How It Works" },
    { id: "draws", label: "Past Draws" },
    ...(isAdmin ? [{ id: "admin", label: "Admin Panel" }] : []),
  ];

  function handleNavClick(id: string) {
    onNavClick(id);
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
  }

  function copyAddress() {
    navigator.clipboard.writeText(principal).then(() => {
      setCopied(true);
      toast.success("Deposit address copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(11, 7, 16, 0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(184, 138, 42, 0.3)",
      }}
    >
      {/* Main bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("top")}
          className="flex items-center gap-2 group flex-shrink-0"
          data-ocid="nav.link"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #F6D27A, #C7902B)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5L12 2Z"
                fill="#0B0710"
              />
            </svg>
          </div>
          <span className="font-cinzel text-base font-bold gold-gradient hidden sm:block">
            ICP Lucky Draw
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="font-cinzel text-sm tracking-wide transition-colors"
              style={{ color: "oklch(0.84 0.02 300)" }}
              onMouseEnter={setGold}
              onMouseLeave={unsetGold}
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side: wallet + hamburger */}
        <div className="flex items-center gap-2">
          {/* Wallet area */}
          {isInitializing ? (
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: "#C7902B" }}
            />
          ) : isConnected ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-cinzel"
                style={{
                  background: "oklch(0.10 0.04 295)",
                  border: "1px solid #B88A2A",
                  color: "#F6D27A",
                }}
                data-ocid="nav.toggle"
              >
                <Wallet className="h-4 w-4 flex-shrink-0" />
                {/* Desktop: show truncated principal + balance */}
                <div className="hidden md:flex flex-col items-start">
                  <span>{truncatePrincipal(principal)}</span>
                  {icpBalance !== undefined && (
                    <span
                      className="text-xs font-normal"
                      style={{ color: "#C7902B" }}
                    >
                      {e8sToIcp(icpBalance).toFixed(4)} ICP
                    </span>
                  )}
                </div>
                {/* Mobile: balance only if available */}
                {icpBalance !== undefined && (
                  <span
                    className="text-xs font-normal md:hidden"
                    style={{ color: "#C7902B" }}
                  >
                    {e8sToIcp(icpBalance).toFixed(2)} ICP
                  </span>
                )}
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Desktop dropdown */}
              {desktopMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-72 rounded-lg overflow-hidden shadow-gold z-50"
                  style={{
                    background: "oklch(0.10 0.04 295)",
                    border: "1px solid #B88A2A",
                  }}
                >
                  {/* Deposit address */}
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid rgba(184,138,42,0.25)" }}
                  >
                    <p
                      className="text-xs font-cinzel mb-1"
                      style={{ color: "#C7902B" }}
                    >
                      Deposit Address
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs break-all flex-1"
                        style={{ color: "#F2EDF7", fontFamily: "monospace" }}
                      >
                        {principal}
                      </span>
                      <button
                        type="button"
                        onClick={copyAddress}
                        className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                        style={{ color: copied ? "#4ade80" : "#F6D27A" }}
                        title="Copy address"
                        data-ocid="nav.button"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ICP Balance */}
                  {icpBalance !== undefined && (
                    <div
                      className="px-4 py-3"
                      style={{
                        borderBottom: "1px solid rgba(184,138,42,0.25)",
                      }}
                    >
                      <p
                        className="text-xs font-cinzel mb-0.5"
                        style={{ color: "#C7902B" }}
                      >
                        ICP Balance
                      </p>
                      <p
                        className="text-base font-cinzel font-bold"
                        style={{ color: "#F6D27A" }}
                      >
                        {e8sToIcp(icpBalance).toFixed(4)} ICP
                      </p>
                    </div>
                  )}

                  {/* Disconnect */}
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setDesktopMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-left flex items-center gap-2 hover:bg-white/5 transition-colors font-cinzel"
                    style={{ color: "#C7902B" }}
                    data-ocid="nav.button"
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="btn-gold px-3 py-2 text-xs sm:text-sm rounded-lg font-cinzel"
              data-ocid="nav.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Connect Wallet</span>
                  <span className="ml-1 sm:hidden">Connect</span>
                </>
              )}
            </Button>
          )}

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{
              background: mobileMenuOpen
                ? "oklch(0.13 0.04 295)"
                : "transparent",
              border: "1px solid rgba(184,138,42,0.4)",
              color: "#F6D27A",
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            data-ocid="nav.toggle"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden w-full"
          style={{
            background: "oklch(0.10 0.04 295)",
            borderTop: "1px solid rgba(184,138,42,0.3)",
          }}
        >
          {/* Nav links */}
          <nav className="px-4 pt-3 pb-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg font-cinzel text-sm tracking-wide transition-colors hover:bg-white/5"
                style={{ color: "oklch(0.84 0.02 300)" }}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div
            style={{ borderTop: "1px solid rgba(184,138,42,0.2)" }}
            className="mx-4"
          />

          {/* Wallet section in mobile menu */}
          <div className="px-4 pt-3 pb-4">
            {isConnected ? (
              <div className="flex flex-col gap-3">
                {/* Deposit address */}
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "oklch(0.08 0.03 295)",
                    border: "1px solid rgba(184,138,42,0.3)",
                  }}
                >
                  <p
                    className="text-xs font-cinzel mb-1.5"
                    style={{ color: "#C7902B" }}
                  >
                    Deposit Address
                  </p>
                  <div className="flex items-start gap-2">
                    <p
                      className="text-xs break-all flex-1 leading-relaxed"
                      style={{ color: "#F2EDF7", fontFamily: "monospace" }}
                    >
                      {principal}
                    </p>
                    <button
                      type="button"
                      onClick={copyAddress}
                      className="flex-shrink-0 p-1.5 rounded hover:bg-white/10 transition-colors mt-0.5"
                      style={{ color: copied ? "#4ade80" : "#F6D27A" }}
                      title="Copy address"
                      data-ocid="nav.button"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ICP Balance */}
                {icpBalance !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                    style={{
                      background: "oklch(0.08 0.03 295)",
                      border: "1px solid rgba(184,138,42,0.3)",
                    }}
                  >
                    <span
                      className="text-xs font-cinzel"
                      style={{ color: "#C7902B" }}
                    >
                      ICP Balance
                    </span>
                    <span
                      className="text-sm font-cinzel font-bold"
                      style={{ color: "#F6D27A" }}
                    >
                      {e8sToIcp(icpBalance).toFixed(4)} ICP
                    </span>
                  </div>
                )}

                {/* Disconnect button */}
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-cinzel text-sm transition-colors hover:bg-white/5"
                  style={{
                    border: "1px solid rgba(199,144,43,0.5)",
                    color: "#C7902B",
                  }}
                  data-ocid="nav.button"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoggingIn}
                className="btn-gold w-full py-2.5 text-sm rounded-lg font-cinzel"
                data-ocid="nav.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
