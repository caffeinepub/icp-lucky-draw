export function FloatingDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Gold coins */}
      <div
        className="sparkle"
        style={{ top: "8%", left: "3%", animationDelay: "0s" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <circle
            cx="14"
            cy="14"
            r="13"
            fill="url(#coinGrad)"
            stroke="#F6D27A"
            strokeWidth="1"
          />
          <text
            x="14"
            y="19"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#7A4F12"
          >
            ₿
          </text>
          <defs>
            <radialGradient id="coinGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FFD36A" />
              <stop offset="100%" stopColor="#C7902B" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ top: "20%", right: "4%", animationDelay: "1.5s" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle
            cx="11"
            cy="11"
            r="10"
            fill="url(#coinGrad2)"
            stroke="#F6D27A"
            strokeWidth="1"
          />
          <text
            x="11"
            y="15"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#7A4F12"
          >
            $
          </text>
          <defs>
            <radialGradient id="coinGrad2" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FFD36A" />
              <stop offset="100%" stopColor="#C7902B" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Stars */}
      <div
        className="sparkle"
        style={{ top: "12%", left: "12%", animationDelay: "0.8s" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
            fill="#FFD36A"
            opacity="0.8"
          />
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ top: "6%", right: "15%", animationDelay: "2s" }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
            fill="#FFD36A"
            opacity="0.6"
          />
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ bottom: "20%", left: "5%", animationDelay: "3s" }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <polygon
            points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
            fill="#F6D27A"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Blue diamonds */}
      <div
        className="sparkle"
        style={{ top: "35%", right: "3%", animationDelay: "0.5s" }}
      >
        <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
          <polygon points="10,0 20,8 10,24 0,8" fill="#4BB6FF" opacity="0.7" />
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ bottom: "30%", right: "8%", animationDelay: "2.5s" }}
      >
        <svg width="16" height="20" viewBox="0 0 20 24" aria-hidden="true">
          <polygon points="10,0 20,8 10,24 0,8" fill="#4BB6FF" opacity="0.5" />
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ top: "50%", left: "2%", animationDelay: "1s" }}
      >
        <svg width="14" height="18" viewBox="0 0 20 24" aria-hidden="true">
          <polygon points="10,0 20,8 10,24 0,8" fill="#4BB6FF" opacity="0.4" />
        </svg>
      </div>

      {/* Red 7s */}
      <div
        className="sparkle"
        style={{ bottom: "15%", right: "5%", animationDelay: "1.2s" }}
      >
        <svg width="24" height="30" viewBox="0 0 30 36" aria-hidden="true">
          <text
            x="2"
            y="30"
            fontSize="32"
            fontWeight="900"
            fill="#C61E1E"
            opacity="0.6"
            fontFamily="serif"
          >
            7
          </text>
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ top: "70%", left: "4%", animationDelay: "3.5s" }}
      >
        <svg width="20" height="26" viewBox="0 0 30 36" aria-hidden="true">
          <text
            x="2"
            y="30"
            fontSize="32"
            fontWeight="900"
            fill="#C61E1E"
            opacity="0.4"
            fontFamily="serif"
          >
            7
          </text>
        </svg>
      </div>

      {/* Sparkle crosses */}
      <div
        className="sparkle"
        style={{ top: "40%", left: "8%", animationDelay: "4s" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <line
            x1="8"
            y1="0"
            x2="8"
            y2="16"
            stroke="#FFD36A"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <line
            x1="0"
            y1="8"
            x2="16"
            y2="8"
            stroke="#FFD36A"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <line
            x1="2"
            y1="2"
            x2="14"
            y2="14"
            stroke="#FFD36A"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="14"
            y1="2"
            x2="2"
            y2="14"
            stroke="#FFD36A"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </div>
      <div
        className="sparkle"
        style={{ bottom: "8%", left: "15%", animationDelay: "2.2s" }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <line
            x1="8"
            y1="0"
            x2="8"
            y2="16"
            stroke="#FFD36A"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="0"
            y1="8"
            x2="16"
            y2="8"
            stroke="#FFD36A"
            strokeWidth="1.5"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
