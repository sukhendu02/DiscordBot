import React from "react";
import { Zap } from "lucide-react";

export default function ConnectServerBanner() {
  return (
    <div className="w-full md:w-full lg:w-1/2 relative overflow-hidden rounded-2xl bg-linear-to-br from-[#5865F2] via-[#7C6CF7] to-[#EB459E] p-8 shadow-xl shadow-[#5865F2]/25 sm:p-10">
      <style>{`
        @keyframes pulseNode {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .node { animation: pulseNode 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .node { animation: none; opacity: 0.7; }
        }
      `}</style>

      {/* Network / connection motif */}
      <svg
        viewBox="0 0 400 200"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        fill="none"
      >
        <line x1="40" y1="30" x2="140" y2="90" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="140" y1="90" x2="260" y2="40" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="140" y1="90" x2="220" y2="150" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="260" y1="40" x2="360" y2="80" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="220" y1="150" x2="330" y2="160" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />

        <circle className="node" cx="40" cy="30" r="4" fill="#ffffff" style={{ animationDelay: "0s" }} />
        <circle className="node" cx="140" cy="90" r="5" fill="#ffffff" style={{ animationDelay: "0.4s" }} />
        <circle className="node" cx="260" cy="40" r="4" fill="#ffffff" style={{ animationDelay: "0.8s" }} />
        <circle className="node" cx="220" cy="150" r="4" fill="#ffffff" style={{ animationDelay: "1.2s" }} />
        <circle className="node" cx="360" cy="80" r="4" fill="#ffffff" style={{ animationDelay: "1.6s" }} />
        <circle className="node" cx="330" cy="160" r="3" fill="#ffffff" style={{ animationDelay: "2s" }} />
      </svg>

      {/* Soft glow accents */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-[#EB459E]/30 blur-3xl" />

      {/* Content */}
      <div className="relative flex flex-col items-start gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
          Live now
        </span>

        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
          Connect to the server
        </h2>

        <p className="text-sm text-white/80">
          Join thousands of members already chatting, playing, and building together.
        </p>

        <button className="mt-3 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#5865F2] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5865F2]">
          Join now
        </button>
      </div>
    </div>
  );
}