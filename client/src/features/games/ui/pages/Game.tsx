import React, { useState, useCallback, memo } from "react";
import { useGameEngine } from "../../engine/useGameEngine";
import { GameCanvas } from "../components/GameCanvas";
import { GameHud } from "../components/GameHud";
import { StartOverlay } from "../components/StartOverlay";
import { CountdownOverlay } from "../components/CountdownOverlay";
import { PauseOverlay } from "../components/PauseOverlay";
import { GameOverOverlay } from "../components/GameOverOverlay";
import { LeaderboardModal } from "../components/LeaderboardModal";
import { InfoModal } from "../components/InfoModal";
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

  // Dialog modals states
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const openLeaderboard = useCallback(() => setIsLeaderboardOpen(true), []);
  const closeLeaderboard = useCallback(() => setIsLeaderboardOpen(false), []);

  const openStore = useCallback(() => setIsStoreOpen(true), []);
  const closeStore = useCallback(() => setIsStoreOpen(false), []);

  const openHowToPlay = useCallback(() => setIsHowToPlayOpen(true), []);
  const closeHowToPlay = useCallback(() => setIsHowToPlayOpen(false), []);

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

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={closeLeaderboard}
        entries={INITIAL_LEADERBOARD}
      />

      <InfoModal
        isOpen={isStoreOpen}
        onClose={closeStore}
        title="ARCADE STORE"
      >
        <p className="font-bold text-[#b61929]">
          BLADES &amp; JUICE TRAIL WORKSHOP COMING SOON!
        </p>
        <p>
          Earn Dojo Tokens by hitting 10x Frenzy Combos in Blitz Mode to unlock
          legendary blades: Rainbow Comet, Plasma Neon, and Shuriken Shadow.
        </p>
      </InfoModal>

      <InfoModal
        isOpen={isHowToPlayOpen}
        onClose={closeHowToPlay}
        title="HOW TO PLAY"
      >
        <div className="space-y-2">
          <p>
            <strong>1. Slice Fruits:</strong> Click and drag your mouse or touch swipe across rising fruits to slice them.
          </p>
          <p>
            <strong>2. Build Combos:</strong> Slice multiple fruits in a single swipe stroke for exponential point bonuses!
          </p>
          <p>
            <strong>3. Dodge Bombs:</strong> Slicing a black spiky bomb detonates it and loses a heart!
          </p>
          <p>
            <strong>4. Don't Miss:</strong> In Classic Mode, dropping 3 ripe fruits without slicing will end your run!
          </p>
        </div>
      </InfoModal>

      {/* Trigger helper controls for testing modals in case needed */}
      <div className="hidden">
        <button onClick={openStore}>Store</button>
        <button onClick={openHowToPlay}>How to play</button>
      </div>
    </div>
  );
});

Game.displayName = "Game";
export default Game;
