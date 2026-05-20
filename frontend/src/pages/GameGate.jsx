import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const CORRECT_PASSWORD = "duchess";

const BOOT_LINES = [
  { text: "> Initializing StreakFlow OS...", delay: 0 },
  { text: "> Loading habit modules.............. [OK]", delay: 400 },
  { text: "> Mounting streak engine............. [OK]", delay: 800 },
  { text: "> Connecting to MongoDB.............. [OK]", delay: 1200 },
  { text: "> Loading reflection journal......... [OK]", delay: 1600 },
  { text: "> Checking user authorization........ [LOCKED]", delay: 2000 },
  { text: "", delay: 2400 },
  { text: "╔══════════════════════════════════════╗", delay: 2600 },
  { text: "║     ACCESS RESTRICTED — SF v1.0     ║", delay: 2700 },
  { text: "╚══════════════════════════════════════╝", delay: 2800 },
  { text: "", delay: 3000 },
  { text: "> To unlock the system, solve the cipher below.", delay: 3100 },
  { text: "", delay: 3500 },
];

const CIPHER_LINES = [
  { text: "> CIPHER CHALLENGE:", delay: 0 },
  { text: "> Each number maps to a letter (A=1, B=2 ... Z=26)", delay: 300 },
  { text: "> Decode this sequence:", delay: 600 },
  { text: ">", delay: 900 },
  { text: ">   4  21  3  8  5  19  19", delay: 1100 },
  { text: ">", delay: 1300 },
  { text: "> Enter the decoded word to unlock access:", delay: 1500 },
];

function TypingLine({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (text === "") {
      setDone(true);
      onDone?.();
      return;
    }
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="font-mono text-sm text-green-400 leading-relaxed">
      {displayed}
      {!done && <span className="animate-pulse">█</span>}
    </div>
  );
}

export default function GameGate() {
  const { completeGame } = useGame();
  const navigate = useNavigate();

  const [bootPhase, setBootPhase]       = useState(0);
  const [cipherPhase, setCipherPhase]   = useState(-1);
  const [showInput, setShowInput]       = useState(false);
  const [input, setInput]               = useState("");
  const [attempts, setAttempts]         = useState(3);
  const [status, setStatus]             = useState(null); // null | "error" | "success"
  const [shake, setShake]               = useState(false);
  const [unlocked, setUnlocked]         = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootPhase, cipherPhase, showInput, status, unlocked]);

  // Focus input when shown
  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const handleBootDone = (idx) => {
    if (idx < BOOT_LINES.length - 1) {
      setTimeout(() => setBootPhase(idx + 1), BOOT_LINES[idx + 1]?.delay || 200);
    } else {
      setTimeout(() => setCipherPhase(0), 400);
    }
  };

  const handleCipherDone = (idx) => {
    if (idx < CIPHER_LINES.length - 1) {
      setTimeout(() => setCipherPhase(idx + 1), CIPHER_LINES[idx + 1]?.delay || 200);
    } else {
      setTimeout(() => setShowInput(true), 400);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guess = input.trim().toLowerCase();

    if (guess === CORRECT_PASSWORD) {
      setStatus("success");
      setUnlocked(true);
      setTimeout(() => completeGame(), 2000);
    } else {
      const left = attempts - 1;
      setAttempts(left);
      setStatus("error");
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 600);
      if (left === 0) {
        setTimeout(() => {
          setAttempts(3);
          setStatus(null);
          setInput("");
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
          zIndex: 1
        }} />

      {/* Terminal window */}
      <div className="relative z-10 w-full max-w-2xl">

        {/* Terminal title bar */}
        <div className="flex items-center gap-2 bg-gray-900 border border-green-900 rounded-t-xl px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-green-600 text-xs font-mono">
            streakflow-terminal — bash — 80x24
          </span>
        </div>

        {/* Terminal body */}
        <div className="bg-gray-950 border border-green-900 border-t-0 rounded-b-xl p-6
                        min-h-96 max-h-[70vh] overflow-y-auto space-y-1">

          {/* ASCII header */}
          <div className="font-mono text-green-500 text-xs mb-4 opacity-60">
            <div>  ██████╗████████╗██████╗ ███████╗ █████╗ ██╗  ██╗</div>
            <div> ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔══██╗██║ ██╔╝</div>
            <div> ╚█████╗    ██║   ██████╔╝█████╗  ███████║█████╔╝ </div>
            <div>  ╚═══██╗   ██║   ██╔══██╗██╔══╝  ██╔══██║██╔═██╗ </div>
            <div> ██████╔╝   ██║   ██║  ██║███████╗██║  ██║██║  ██╗</div>
            <div> ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝</div>
          </div>

          {/* Boot lines */}
          {BOOT_LINES.slice(0, bootPhase + 1).map((line, i) => (
            i === bootPhase
              ? <TypingLine key={i} text={line.text} onDone={() => handleBootDone(i)} />
              : <div key={i} className="font-mono text-sm text-green-400 leading-relaxed">{line.text}</div>
          ))}

          {/* Cipher lines */}
          {cipherPhase >= 0 && CIPHER_LINES.slice(0, cipherPhase + 1).map((line, i) => (
            i === cipherPhase
              ? <TypingLine key={`c${i}`} text={line.text} onDone={() => handleCipherDone(i)} />
              : <div key={`c${i}`} className="font-mono text-sm text-cyan-400 leading-relaxed">{line.text}</div>
          ))}

          {/* Input */}
          {showInput && !unlocked && (
            <form onSubmit={handleSubmit} className={`mt-4 ${shake ? "animate-bounce" : ""}`}>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-green-400 text-sm">duchess@streakflow:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-green-300 text-sm outline-none
                             border-b border-green-800 pb-0.5 caret-green-400"
                  placeholder="enter decoded word..."
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              {status === "error" && (
                <div className="mt-2 font-mono text-red-400 text-xs">
                  {`> ACCESS DENIED. ${attempts} attempt${attempts !== 1 ? "s" : ""} remaining.`}
                  {attempts === 0 && " Resetting..."}
                </div>
              )}

              {attempts < 3 && attempts > 0 && status === "error" && (
                <div className="mt-1 font-mono text-yellow-500 text-xs">
                  {`> Hint: The word is your title. Who built this app?`}
                </div>
              )}

              <button type="submit" className="mt-3 font-mono text-xs
                px-4 py-2 border border-green-700 text-green-400
                hover:bg-green-900/30 rounded transition-all">
                [ SUBMIT ]
              </button>
            </form>
          )}

          {/* Success */}
          {unlocked && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <div className="font-mono text-green-400 text-sm">{"> Decrypting..."}</div>
              <div className="font-mono text-green-400 text-sm">{"> Identity verified."}</div>
              <div className="font-mono text-green-300 text-sm font-bold">
                {">"} ACCESS GRANTED. Welcome, Duchess.
              </div>
              <div className="font-mono text-green-500 text-sm">
                {">"} StreakFlow unlocked. Redirecting...
              </div>
              <button
                onClick={() => navigate("/login")}
                className="mt-4 font-mono text-sm px-6 py-2.5 rounded-lg
                           bg-green-500 text-black font-bold
                           hover:bg-green-400 transition-all animate-pulse">
                [ ENTER STREAKFLOW ]
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="mt-4 text-center font-mono text-xs text-green-900">
          StreakFlow OS v1.0 — Unauthorized access is prohibited
        </div>
      </div>
    </div>
  );
}