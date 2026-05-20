import { createContext, useContext, useState } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // No localStorage, no sessionStorage
  // Resets every single time — always starts as false
  const [gameCompleted, setGameCompleted] = useState(false);

  const completeGame = () => {
    setGameCompleted(true);
  };

  const resetGame = () => {
    setGameCompleted(false);
  };

  return (
    <GameContext.Provider value={{ gameCompleted, completeGame, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
