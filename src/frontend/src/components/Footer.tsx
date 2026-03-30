const SOCIAL_LINKS = [
  { icon: "𝕏", label: "X / Twitter" },
  { icon: "💬", label: "Discord" },
  { icon: "📢", label: "Announcements" },
];

const FOOTER_LINKS = ["FAQ", "Terms of Service", "Privacy Policy"];

function hoverGold(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = "#F6D27A";
}
function unhoverGold(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = "oklch(0.60 0.02 300)";
}
function hoverBorder(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = "#B88A2A";
}
function unhoverBorder(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = "rgba(184,138,42,0.3)";
}
function hoverCaffeine(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = "#F6D27A";
}
function unhoverCaffeine(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = "#C7902B";
}

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="relative z-10 mt-16"
      style={{
        borderTop: "1px solid rgba(184,138,42,0.3)",
        background: "oklch(0.05 0.02 295)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4
              className="font-cinzel text-sm font-bold mb-3"
              style={{ color: "#F6D27A" }}
            >
              ICP Lucky Draw
            </h4>
            <p className="text-xs" style={{ color: "oklch(0.60 0.02 300)" }}>
              Decentralized lottery on the Internet Computer. Fair, transparent,
              automatic.
            </p>
          </div>
          <div>
            <h4
              className="font-cinzel text-sm font-bold mb-3"
              style={{ color: "#F6D27A" }}
            >
              Links
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-xs transition-colors"
                    style={{ color: "oklch(0.60 0.02 300)" }}
                    onMouseEnter={hoverGold}
                    onMouseLeave={unhoverGold}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              className="font-cinzel text-sm font-bold mb-3"
              style={{ color: "#F6D27A" }}
            >
              How Pot Works
            </h4>
            <ul className="space-y-2">
              <li className="text-xs" style={{ color: "oklch(0.60 0.02 300)" }}>
                🏆 90% → Winner
              </li>
              <li className="text-xs" style={{ color: "oklch(0.60 0.02 300)" }}>
                🔄 5% → Next Draw
              </li>
              <li className="text-xs" style={{ color: "oklch(0.60 0.02 300)" }}>
                ⚙️ 5% → Maintenance
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="font-cinzel text-sm font-bold mb-3"
              style={{ color: "#F6D27A" }}
            >
              Social
            </h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href="/"
                  aria-label={item.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
                  style={{
                    background: "oklch(0.10 0.04 295)",
                    border: "1px solid rgba(184,138,42,0.3)",
                  }}
                  onMouseEnter={hoverBorder}
                  onMouseLeave={unhoverBorder}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-divider" />

        <p
          className="text-center text-xs"
          style={{ color: "oklch(0.45 0.02 300)" }}
        >
          © {year}. Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "#C7902B" }}
            onMouseEnter={hoverCaffeine}
            onMouseLeave={unhoverCaffeine}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
