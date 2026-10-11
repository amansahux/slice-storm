import React, { useState, useCallback, memo } from "react";
import { useGameEngine } from "../../engine/useGameEngine";
import { GameCanvas } from "../components/GameCanvas";
import { GameHud } from "../components/GameHud";
import { StartOverlay } from "../components/StartOverlay";
import { CountdownOverlay } from "../components/CountdownOverlay";
import { PauseOverlay } from "../components/PauseOverlay";
import { GameOverOverlay } from "../components/GameOverOverlay";
import { LeaderboardModal } from "../components/LeaderboardModal";
import { INITIAL_LEADERBOARD } from "../../config/game.constants";

export const Game: React.FC = memo(() => {
  const {
    canvasRef,
    gameState,
    gameMode,
    selectedBlade,
    countdownValue,
    score,
    lives,
    maxLives,
    fruitsSliced,
    combo,
    maxCombo,
    timeRemainingText,
    setGameMode,
    setSelectedBlade,
    triggerCountdown,
    togglePauseGame,
    restartGame,
    exitToHome,
    handleBladeStart,
    handleAddBladePoint,
    handleBladeEnd,
  } = useGameEngine();

  // Leaderboard modal state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const openLeaderboard = useCallback(() => setIsLeaderboardOpen(true), []);
  const closeLeaderboard = useCallback(() => setIsLeaderboardOpen(false), []);

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[580px] bg-[#F7E8C3] paper-pattern text-[#1b1c1c] font-['Rubik',sans-serif] overflow-hidden flex flex-col justify-between select-none">
      {/* GAME HUD DOCK (Floats right under marquee header) */}
      <GameHud
        score={score}
        combo={combo}
        lives={lives}
        maxLives={maxLives}
        timeRemainingText={timeRemainingText}
        gameMode={gameMode}
        gameState={gameState}
        isPaused={gameState === "PAUSED"}
        onTogglePause={togglePauseGame}
      />

      {/* MAIN PLAYFIELD (HTML5 Game Canvas) */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        <GameCanvas
          canvasRef={canvasRef}
          onBladeStart={handleBladeStart}
          onAddBladePoint={handleAddBladePoint}
          onBladeEnd={handleBladeEnd}
        />

        {/* Dynamic Overlays according to game state */}
        {gameState === "START" && (
          <StartOverlay
            gameMode={gameMode}
            onSelectGameMode={setGameMode}
            selectedBlade={selectedBlade}
            onSelectBlade={setSelectedBlade}
            onStartGame={triggerCountdown}
          />
        )}

        {gameState === "COUNTDOWN" && (
          <CountdownOverlay countdownValue={countdownValue} />
        )}

        {gameState === "PAUSED" && (
          <PauseOverlay
            onResume={togglePauseGame}
            onRestart={restartGame}
            onMainMenu={exitToHome}
          />
        )}

        {gameState === "GAMEOVER" && (
          <GameOverOverlay
            score={score}
            fruitsSliced={fruitsSliced}
            maxCombo={maxCombo}
            onPlayAgain={restartGame}
            onOpenLeaderboard={openLeaderboard}
          />
        )}
      </main>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={closeLeaderboard}
        entries={INITIAL_LEADERBOARD}
      />
    </div>
  );
});

Game.displayName = "Game";
export default Game;
