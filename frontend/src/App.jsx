import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProvider, useGame } from "./context/GameContext";

import GameGate  from "./pages/GameGate";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Only accessible after game is completed
function GameRoute({ children }) {
  const { gameCompleted } = useGame();
  return gameCompleted ? children : <Navigate to="/" replace />;
}

// Only accessible when NOT logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const { gameCompleted } = useGame();

  if (!gameCompleted) return <Navigate to="/" replace />;
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

// Only accessible when logged in
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1117]">
      <div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

// Game gate — redirect away if already completed
function GateRoute({ children }) {
  const { gameCompleted } = useGame();
  return !gameCompleted ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <GameProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="bottom-center" toastOptions={{
            style: { borderRadius: "12px", fontWeight: 600, fontSize: "0.9rem" }
          }} />
          <Routes>
            <Route path="/"          element={<GateRoute><GameGate /></GateRoute>} />
            <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GameProvider>
  );
}
