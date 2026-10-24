import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  createSessionAPI,
  updateSessionStatusAPI,
  createGameAPI,

  type CreateGamePayload,
  type GameMode,
  type GameSessionStatus,
} from "../apis/game.api";
import { useGameEngine } from "../engine/useGameEngine";


export const GAME_QUERY_KEYS = {
  history: (page = 1) => ["games", "history", page] as const,
};

/**
 * useGame Hook
 * Central hub for all game business logic & server-state management (TanStack Query):
 * - Integrates 60 FPS HTML5 game engine
 * - Manages secure Session lifecycle (create session -> start countdown -> play -> sync game result)
 * - Records game results to server on GAMEOVER with optimistic cache updates
 * - Records game results to server on GAMEOVER with optimistic cache updates
 * - Complies strictly with OPTIMIZATION_RULES.md (Stable references, memoized derived values, no duplicate state)
 */
export const useGame = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Engine instance driving 60 FPS animation and canvas interactions
  const engine = useGameEngine();

  // Active server session state & references
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const activeSessionRef = useRef<string | null>(null);
  const hasSubmittedGameRef = useRef<boolean>(false);



  // Sync session ref
  useEffect(() => {
    activeSessionRef.current = currentSessionId;
  }, [currentSessionId]);

  // ── 1. TANSTACK QUERY MUTATIONS ──

  // Create Session Mutation
  const createSessionMutation = useMutation({
    mutationFn: async (mode: GameMode) => {
      const response = await createSessionAPI(mode);
      return response.data.data;
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.sessionId);
      activeSessionRef.current = data.sessionId;
    },
    onError: (err) => {
      console.warn("Session initiation failed or player is offline/guest:", err);
    },
  });

  // Update Session Status Mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      status,
    }: {
      sessionId: string;
      status: GameSessionStatus;
    }) => {
      const response = await updateSessionStatusAPI(sessionId, status);
      return response.data.data;
    },
  });

  // Record Game Run Mutation
  const saveGameMutation = useMutation({
    mutationFn: async (payload: CreateGamePayload) => {
      const response = await createGameAPI(payload);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate relevant query caches to refresh stats (Rule 06)
      queryClient.invalidateQueries({ queryKey: ["games", "history"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      console.error("Failed to record game score:", err);
    },
  });


  // ── 3. GAME LIFECYCLE & BUSINESS LOGIC ──

  /**
   * Start Game Flow:
   * 1. If authenticated, create server session asynchronously
   * 2. Trigger countdown and start engine
   */
  const handleStartGame = useCallback(async () => {
    hasSubmittedGameRef.current = false;

    if (isAuthenticated) {
      try {
        const sessionData = await createSessionMutation.mutateAsync(engine.gameMode);
        activeSessionRef.current = sessionData.sessionId;
      } catch (err) {
        console.warn("Proceeding in guest/offline session mode:", err);
      }
    }

    engine.triggerCountdown();
  }, [engine, isAuthenticated, createSessionMutation]);

  /**
   * Restart Game Flow:
   * If session is not finished/submitted yet, mark current active session as abandoned,
   * then create a new session and restart match.
   */
  const handleRestartGame = useCallback(() => {
    const activeSession = activeSessionRef.current;
    if (activeSession && !hasSubmittedGameRef.current && isAuthenticated) {
      updateSessionMutation.mutate({
        sessionId: activeSession,
        status: "abandoned",
      });
    }
    // Reset active session references before starting new session
    setCurrentSessionId(null);
    activeSessionRef.current = null;
    handleStartGame();
  }, [handleStartGame, isAuthenticated, updateSessionMutation]);

  /**
   * Exit To Home / Abandon Flow
   */
  const handleExitToHome = useCallback(() => {
    const activeSession = activeSessionRef.current;
    if (activeSession && !hasSubmittedGameRef.current && isAuthenticated) {
      updateSessionMutation.mutate({
        sessionId: activeSession,
        status: "abandoned",
      });
    }
    setCurrentSessionId(null);
    activeSessionRef.current = null;
    engine.exitToHome();
  }, [engine, isAuthenticated, updateSessionMutation]);

  /**
   * Game Over Synchronization Effect:
   * Automatically synchronizes game stats with backend on game over
   */
  useEffect(() => {
    if (engine.gameState === "GAMEOVER" && !hasSubmittedGameRef.current) {
      hasSubmittedGameRef.current = true;
      const activeSession = activeSessionRef.current;

      if (isAuthenticated && activeSession) {
        const duration =
          engine.gameMode === "arcade"
            ? 60 - engine.timeRemaining
            : engine.gameMode === "zen"
            ? 90 - engine.timeRemaining
            : engine.survivalSeconds;

        saveGameMutation.mutate({
          sessionId: activeSession,
          mode: engine.gameMode,
          score: engine.score,
          fruitsSliced: engine.fruitsSliced,
          fruitsMissed: engine.fruitsMissed,
          bombsHit: engine.bombsHit,
          maxCombo: engine.maxCombo,
          duration: Math.max(1, duration),
          status: "completed",
        });
      }
    }
  }, [
    engine.gameState,
    engine.gameMode,
    engine.score,
    engine.fruitsSliced,
    engine.fruitsMissed,
    engine.bombsHit,
    engine.maxCombo,
    engine.survivalSeconds,
    engine.timeRemaining,
    isAuthenticated,
    saveGameMutation,
  ]);



  return {
    // Engine Passthroughs
    canvasRef: engine.canvasRef,
    gameState: engine.gameState,
    gameMode: engine.gameMode,
    selectedBlade: engine.selectedBlade,
    countdownValue: engine.countdownValue,
    score: engine.score,
    lives: engine.lives,
    maxLives: engine.maxLives,
    fruitsSliced: engine.fruitsSliced,
    combo: engine.combo,
    maxCombo: engine.maxCombo,
    timeRemainingText: engine.timeRemainingText,
    setGameMode: engine.setGameMode,
    setSelectedBlade: engine.setSelectedBlade,
    togglePauseGame: engine.togglePauseGame,
    handleBladeStart: engine.handleBladeStart,
    handleAddBladePoint: engine.handleAddBladePoint,
    handleBladeEnd: engine.handleBladeEnd,

    // Orchestrated Business Actions
    startGame: handleStartGame,
    restartGame: handleRestartGame,
    exitToHome: handleExitToHome,



    // Server State
    currentSessionId,
    isSavingGame: saveGameMutation.isPending,
    isStartingSession: createSessionMutation.isPending,
    isAuthenticated,
    user,
  };
};
