import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

// ── Puzzle Bank — random puzzle picked each session ──────────────────────
const PUZZLES = [
  {
    id: 1,
    type: "caesar",
    question: "Decode this Caesar cipher (shift 3):",
    clue: "GXFKHVV",
    answer: "duchess",
    hint: "Think about who built this app. Shift each letter back by 3.",
  },
  {
    id: 2,
    type: "reverse",
    question: "Reverse this string to find the password:",
    clue: "SSEHCUD",
    answer: "duchess",
    hint: "Read it backwards.",
  },
  {
    id: 3,
    type: "binary",
    question: "Each number = position in alphabet. Decode:",
    clue: "04 · 21 · 03 · 08 · 05 · 19 · 19",
    answer: "duchess",
    hint: "A=1, B=2, C=3... D=4",
  },
  {
    id: 4,
    type: "morse",
    question: "Decode this partial morse — first 3 letters only, then guess the full word:",
    clue: "-.. / ..- / -.-.",
    answer: "duchess",
    hint: "D=(-.. ) U=(..-) C=(-.-.) — what word starts with DUC?",
  },
  {
    id: 5,
    type: "scramble",
    question: "Unscramble this word — it's the title of the app creator:",
    clue: "H S S E C D U",
    answer: "duchess",
    hint: "Think royalty. Think hacker. Think builder.",
  },
];

// ── Boot sequence lines ───────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "> Initializing StreakFlow OS v2.0...", delay: 0 },
  { text: "> Loading kernel modules............. [OK]", delay: 350 },
  { text: "> Mounting encrypted volumes......... [OK]", delay: 700 },
  { text: "> Connecting to MongoDB Atlas........ [OK]", delay: 1050 },
  { text: "> Loading habit engine............... [OK]", delay: 1400 },
  { text: "> Loading streak calculator.......... [OK]", delay: 1750 },
  { text: "> Scanning for authorized users...... [FAILED]", delay: 2100 },
  { text: "> Firewall engaged................... [ACTIVE]", delay: 2400 },
  { text: "", delay: 2700 },
  { text: "╔════════════════════════════════════════════╗", delay: 2900 },
  { text: "║       ACCESS RESTRICTED — SF OS v2.0      ║", delay: 3000 },
  { text: "║    Unauthorized access will be logged.    ║", delay: 3100 },
  { text: "╚════════════════════════════════════════════╝", delay: 3200 },
  { text: "", delay: 3400 },
  { text: "> Identity verification required.", delay: 3500 },
  { text: "> Generating puzzle challenge......", delay: 3800 },
  { text: "> Puzzle loaded. Solve to gain access.", delay: 4200 },
  { text: "", delay: 4400 },
];

// ── Typing animation component ────────────────────────────────────────────
function TypingLine({ text, speed = 18, onDone, color = "text-green-400" }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (text === "") {
      setDone(true);
      onDone?.();
      return;
    }
    const iv = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(iv);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <div className={`font-mono text-sm leading-relaxed ${color}`}>
      {displayed}
      {!done && <span className="animate-pulse">█</span>}
    </div>
  );
}

// ── Glitch text effect ────────────────────────────────────────────────────
function GlitchText({ text, className = "" }) {
  const [glitched, setGlitched] = useState(text);
  const chars = "!@#$%^&*<>?/\\|{}[]~`";

  useEffect(() => {
    let count = 0;
    const iv = setInterval(() => {
      if (count > 8) { setGlitched(text); clearInterval(iv); return; }
      setGlitched(text.split("").map((c, i) =>
        Math.random() > 0.6 ? chars[Math.floor(Math.random() * chars.length)] : c
      ).join(""));
      count++;
    }, 60);
    return () => clearInterval(iv);
  }, [text]);

  return <span className={className}>{glitched}</span>;
}

// ── Decrypting animation ──────────────────────────────────────────────────
function DecryptingText({ finalText, onDone }) {
  const [display, setDisplay] = useState("DECRYPTING...");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setStep(s => {
        if (s >= finalText.length + 6) {
          clearInterval(iv);
          setDisplay(finalText);
          setTimeout(() => onDone?.(), 400);
          return s;
        }
        const revealed = finalText.slice(0, Math.max(0, s - 3));
        const scrambled = Array.from({ length: finalText.length - revealed.length },
          () => chars[Math.floor(Math.random() * chars.length)]).join("");
        setDisplay(revealed + scrambled);
        return s + 1;
      });
    }, 60);
    return () => clearInterval(iv);
  }, [finalText]);

  return (
    <span className="font-mono text-green-300 font-bold tracking-widest text-lg">
      {display}
    </span>
  );
}

// ── Main GameGate ─────────────────────────────────────────────────────────
export default function GameGate() {
  const { completeGame } = useGame();
  const navigate = useNavigate();

  // Pick a random puzzle each session
  const [puzzle] = useState(() => PUZZLES[Math.floor(Math.random() * PUZZLES.length)]);

  const [bootPhase, setBootPhase]       = useState(0);
  const [showPuzzle, setShowPuzzle]     = useState(false);
  const [showInput, setShowInput]       = useState(false);
  const [input, setInput]               = useState("");
  const [attempts, setAttempts]         = useState(3);
  const [showHint, setShowHint]         = useState(false);
  const [status, setStatus]             = useState(null);
  const [shake, setShake]               = useState(false);
  const [unlocked, setUnlocked]         = useState(false);
  const [decrypting, setDecrypting]     = useState(false);
  const [skipAvailable, setSkipAvailable] = useState(false);
  const inputRef  = useRef(null);
  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootPhase, showPuzzle, showInput, status, unlocked]);

  // Focus input
  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  // Show skip after 2 failed attempts
  useEffect(() => {
    if (attempts <= 1) setSkipAvailable(true);
  }, [attempts]);

  const handleBootDone = (idx) => {
    const next = idx + 1;
    if (next < BOOT_LINES.length) {
      setTimeout(() => setBootPhase(next), BOOT_LINES[next]?.delay
        ? BOOT_LINES[next].delay - BOOT_LINES[idx].delay
        : 200);
    } else {
      setTimeout(() => setShowPuzzle(true), 400);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guess = input.trim().toLowerCase();
    const correct = puzzle.answer.toLowerCase();

    if (guess === correct) {
      setStatus("success");
      setDecrypting(true);
    } else {
      const left = attempts - 1;
      setAttempts(left);
      setStatus("error");
      setShake(true);
      setInput("");
      setTimeout(() => { setShake(false); setStatus(null); }, 800);
      if (left <= 1) setShowHint(true);
    }
  };

  const handleUnlocked = () => {
    setUnlocked(true);
    setTimeout(() => completeGame(), 1500);
  };

  const handleSkip = () => {
    completeGame();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background grid effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)"
        }} />

      {/* Glow effect top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-32 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00ff00, transparent)" }} />

      <div className="relative z-20 w-full max-w-2xl">

        {/* Terminal window */}
        <div className="rounded-t-xl border border-green-900 bg-gray-900 px-4 py-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow shadow-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow shadow-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow shadow-green-500" />
          <span className="ml-3 text-green-600 text-xs font-mono">
            streakflow-os — terminal — {puzzle.type.toUpperCase()} CHALLENGE
          </span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-700 text-xs font-mono">LIVE</span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="bg-gray-950 border border-green-900 border-t-0 rounded-b-xl p-5
                        min-h-96 max-h-[75vh] overflow-y-auto space-y-1
                        shadow-2xl shadow-green-900/20">

          {/* ASCII Logo */}
          <div className="font-mono text-green-600 text-[10px] mb-3 opacity-50 leading-tight hidden sm:block">
            <div>  ██████╗ ████████╗██████╗ ███████╗ █████╗ ██╗  ██╗</div>
            <div> ██╔════╝ ╚══██╔══╝██╔══██╗██╔════╝██╔══██╗██║ ██╔╝</div>
            <div> ╚█████╗     ██║   ██████╔╝█████╗  ███████║█████╔╝ </div>
            <div>  ╚═══██╗    ██║   ██╔══██╗██╔══╝  ██╔══██║██╔═██╗ </div>
            <div> ██████╔╝    ██║   ██║  ██║███████╗██║  ██║██║  ██╗</div>
            <div> ╚═════╝     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝</div>
          </div>

          {/* Boot sequence */}
          {BOOT_LINES.slice(0, bootPhase + 1).map((line, i) => (
            i === bootPhase && !showPuzzle
              ? <TypingLine key={i} text={line.text}
                  color={line.text.includes("FAILED") || line.text.includes("ACTIVE")
                    ? "text-red-400" : line.text.includes("OK") ? "text-green-400" : "text-green-500"}
                  onDone={() => handleBootDone(i)} />
              : <div key={i} className={`font-mono text-sm leading-relaxed
                  ${line.text.includes("FAILED") || line.text.includes("ACTIVE")
                    ? "text-red-400" : line.text.includes("OK")
                    ? "text-green-400" : "text-green-600"}`}>
                  {line.text}
                </div>
          ))}

          {/* Puzzle section */}
          {showPuzzle && (
            <div className="mt-3 space-y-3 animate-fade-in">
              <div className="border border-green-800 rounded-xl p-4 bg-green-950/20">

                {/* Puzzle type badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded
                                   bg-green-900/50 text-green-400 border border-green-800 uppercase tracking-widest">
                    {puzzle.type} challenge
                  </span>
                  <span className="text-xs text-green-700 font-mono">
                    — solve to unlock access
                  </span>
                </div>

                {/* Question */}
                <div className="font-mono text-green-300 text-sm mb-3">
                  {">"} {puzzle.question}
                </div>

                {/* Clue */}
                <div className="bg-black/50 border border-green-900 rounded-lg p-4 text-center mb-3">
                  <div className="font-mono text-xl font-bold tracking-[0.3em] text-green-300">
                    <GlitchText text={puzzle.clue} className="text-green-300" />
                  </div>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="font-mono text-yellow-500 text-xs bg-yellow-900/10
                                  border border-yellow-800/50 rounded-lg px-3 py-2 mb-3 animate-fade-in">
                    {">"} HINT: {puzzle.hint}
                  </div>
                )}

                {/* Input form */}
                {!showInput && (
                  <button onClick={() => setShowInput(true)}
                    className="font-mono text-xs text-green-500 hover:text-green-300
                               border border-green-800 hover:border-green-600
                               px-4 py-2 rounded-lg transition-all">
                    {">"} BEGIN DECRYPTION
                  </button>
                )}

                {showInput && !unlocked && (
                  <form onSubmit={handleSubmit}
                    className={`space-y-3 ${shake ? "animate-bounce" : ""}`}>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-green-600 text-sm flex-shrink-0">
                        root@streakflow:~$
                      </span>
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="enter decoded password..."
                        autoComplete="off"
                        spellCheck={false}
                        className="flex-1 bg-transparent text-green-300 text-sm outline-none
                                   border-b border-green-800 pb-0.5 caret-green-400
                                   placeholder-green-900 font-mono"
                      />
                    </div>

                    {/* Attempt indicators */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-green-800">ATTEMPTS:</span>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i}
                          className={`w-2 h-2 rounded-full transition-all
                            ${i < attempts ? "bg-green-500 shadow shadow-green-500" : "bg-gray-700"}`} />
                      ))}
                      <span className="text-xs font-mono text-green-700 ml-1">
                        {attempts} remaining
                      </span>
                    </div>

                    {/* Error message */}
                    {status === "error" && (
                      <div className="font-mono text-red-400 text-xs animate-fade-in">
                        {">"} ACCESS DENIED. Incorrect password. Try again.
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <button type="submit"
                        className="font-mono text-xs px-4 py-2 border border-green-700
                                   text-green-400 hover:bg-green-900/30 rounded-lg transition-all">
                        [ SUBMIT ]
                      </button>

                      {!showHint && (
                        <button type="button" onClick={() => setShowHint(true)}
                          className="font-mono text-xs px-4 py-2 border border-yellow-800
                                     text-yellow-600 hover:bg-yellow-900/20 rounded-lg transition-all">
                          [ HINT ]
                        </button>
                      )}

                      {skipAvailable && (
                        <button type="button" onClick={handleSkip}
                          className="font-mono text-xs px-4 py-2 border border-gray-700
                                     text-gray-500 hover:bg-gray-900/30 rounded-lg transition-all">
                          [ SKIP PUZZLE ]
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Decrypting animation */}
                {decrypting && !unlocked && (
                  <div className="mt-3 space-y-1 animate-fade-in">
                    <div className="font-mono text-green-400 text-sm">
                      {">"} Password accepted. Decrypting identity...
                    </div>
                    <DecryptingText
                      finalText="ACCESS GRANTED"
                      onDone={handleUnlocked}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unlocked screen */}
          {unlocked && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <div className="font-mono text-green-400 text-sm">
                {">"} Identity verified.
              </div>
              <div className="font-mono text-green-400 text-sm">
                {">"} Firewall disabled.
              </div>
              <div className="font-mono text-green-300 text-sm font-bold">
                {">"} Welcome back, Duchess.
              </div>
              <div className="font-mono text-green-500 text-sm">
                {">"} Loading StreakFlow...
              </div>

              {/* Progress bar */}
              <div className="bg-gray-900 rounded-full h-1.5 overflow-hidden mt-2">
                <div className="h-full bg-green-500 rounded-full animate-pulse"
                  style={{ width: "100%", transition: "width 1.5s ease" }} />
              </div>

              <button onClick={() => navigate("/login")}
                className="mt-4 font-mono text-sm px-6 py-3 rounded-xl
                           bg-green-500 text-black font-bold
                           hover:bg-green-400 transition-all w-full
                           shadow-lg shadow-green-500/30">
                [ ENTER STREAKFLOW ]
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="mt-3 flex justify-between items-center">
          <span className="font-mono text-xs text-green-900">
            StreakFlow OS v2.0 — All sessions monitored
          </span>
          <span className="font-mono text-xs text-green-900">
            Built by The Duchess of Hackers
          </span>
        </div>
      </div>
    </div>
  );
}