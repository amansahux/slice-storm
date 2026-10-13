import React, { memo } from "react";
import { GameCanvas } from "../components/GameCanvas";
import { GameHud } from "../components/GameHud";
import { StartOverlay } from "../components/StartOverlay";
import { CountdownOverlay } from "../components/CountdownOverlay";
import { PauseOverlay } from "../components/PauseOverlay";
import { GameOverOverlay } from "../components/GameOverOverlay";
import { LeaderboardModal } from "../components/LeaderboardModal";
import { useGame } from "../../hooks/useGAme";

export const Game: React.FC = memo(() => {
  // All business logic, session orchestration & TanStack Query states encapsulated in useGame hook
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
    startGame,
    togglePauseGame,
    restartGame,
    exitToHome,
    handleBladeStart,
    handleAddBladePoint,
    handleBladeEnd,
    isLeaderboardOpen,
    openLeaderboard,
    closeLeaderboard,
    leaderboardEntries,
    isLeaderboardLoading,
    isSavingGame,
  } = useGame();

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
            onStartGame={startGame}
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
            onMainMenu={exitToHome}
          />
        )}

        {/* Subtle syncing toast when saving score to server */}
        {isSavingGame && gameState === "GAMEOVER" && (
          <div className="absolute top-4 right-4 z-30 bg-[#FFF4D6] border-2 border-[#1b1c1c] px-3 py-1.5 rounded-lg shadow-[3px_3px_0px_#1b1c1c] flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="text-xs font-bold font-['Rubik',sans-serif] text-[#1b1c1c]">
              SYNCING SCORE...
            </span>
          </div>
        )}
      </main>

      {/* Leaderboard Modal backed by live TanStack Query server data */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={closeLeaderboard}
        entries={leaderboardEntries}
        isLoading={isLeaderboardLoading}
      />
    </div>
  );
});

Game.displayName = "Game";
export default Game;
