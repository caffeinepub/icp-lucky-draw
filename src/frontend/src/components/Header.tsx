import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: icpBalance } = useIcpBalance();
  const isLoggingIn = loginStatus === "logging-in";
  const isConnected = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";

  const navLinks = [
    { id: "play", label: "Play" },
    { id: "how", label: "How It Works" },
    { id: "draws", label: "Past Draws" },
    ...(isAdmin ? [{ id: "admin", label: "Admin" }] : []),
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(11, 7, 16, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(184, 138, 42, 0.3)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavClick("top")}
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
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
          <span className="font-cinzel text-lg font-bold gold-gradient hidden sm:block">
            ICP Lucky Draw
          </span>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => onNavClick(link.id)}
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

        {/* Connect Wallet */}
        <div className="flex items-center gap-2">
          {isInitializing ? (
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: "#C7902B" }}
            />
          ) : isConnected ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-cinzel"
                style={{
                  background: "oklch(0.10 0.04 295)",
                  border: "1px solid #B88A2A",
                  color: "#F6D27A",
                }}
                data-ocid="nav.toggle"
              >
                <Wallet className="h-4 w-4" />
                <div className="hidden sm:flex flex-col items-start">
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
                <ChevronDown className="h-3 w-3" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 rounded-lg overflow-hidden shadow-gold z-50"
                  style={{
                    background: "oklch(0.10 0.04 295)",
                    border: "1px solid #B88A2A",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setMenuOpen(false);
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
              className="btn-gold px-4 py-2 text-sm rounded-lg font-cinzel"
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
    </header>
  );
}
