import { useState, useRef, useEffect, useCallback } from "react";
import type {
  GameMode,
  GameState,
  BladeTheme,
  FlyingEntity,
  JuiceParticle,
  TextPopup,
  BladePoint,
} from "../config/game.types";
import {
  FRUIT_TYPES,
  BLADE_THEMES,
  GAME_CONSTANTS,
} from "../config/game.constants";
import { lineIntersectsCircle } from "../systems/collisionSystem";
import { arcadeAudioEngine } from "../systems/audioSystem";
import { toggleSound } from "../../../shared/utils/arcadeAudio";
import {
  drawCartoonFruit,
  drawFruitHalf,
  drawCartoonBomb,
  drawBladeTrail,
  drawJuiceParticles,
  drawTextPopups,
} from "../rendering/gameCanvasRenderer";

export const useGameEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React states driving HUD and Overlays
  const [gameState, setGameState] = useState<GameState>("START");
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [selectedBlade, setSelectedBlade] = useState<BladeTheme>(BLADE_THEMES[0]);
  const [countdownValue, setCountdownValue] = useState<number | string>(3);

  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(GAME_CONSTANTS.MAX_LIVES);
  const [fruitsSliced, setFruitsSliced] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_CONSTANTS.BLITZ_DURATION);
  const [survivalSeconds, setSurvivalSeconds] = useState<number>(60);

  // Mutable refs for high-frequency 60 FPS animation (Rule 01 & Rule 02)
  const stateRef = useRef<GameState>("START");
  const modeRef = useRef<GameMode>("classic");
  const bladeThemeRef = useRef<BladeTheme>(BLADE_THEMES[0]);

  const flyingEntitiesRef = useRef<FlyingEntity[]>([]);
  const juiceParticlesRef = useRef<JuiceParticle[]>([]);
  const textPopupsRef = useRef<TextPopup[]>([]);
  const bladePointsRef = useRef<BladePoint[]>([]);
  const entityIdCounter = useRef(0);

  const screenShakeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameClockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    modeRef.current = gameMode;
  }, [gameMode]);

  useEffect(() => {
    bladeThemeRef.current = selectedBlade;
  }, [selectedBlade]);

  // Audio helper — delegates to unified arcadeAudio so navbar mute stays in sync
  const handleSoundToggle = useCallback(() => {
    toggleSound();
  }, []);

  // Format MM:SS
  const formatTime = useCallback((totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const timeRemainingText =
    gameMode === "blitz" ? formatTime(timeRemaining) : formatTime(survivalSeconds);

  // Spawning logic
  const spawnWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 items

    for (let i = 0; i < count; i++) {
      entityIdCounter.current++;
      const isBomb = Math.random() < GAME_CONSTANTS.BOMB_CHANCE;
      const startX = Math.random() * (rect.width * 0.7) + rect.width * 0.15;
      const startY = rect.height + 40;

      const targetX = rect.width / 2 + (Math.random() * 300 - 150);
      const vx = (targetX - startX) * 0.012 + (Math.random() * 2 - 1);
      const vy = -(Math.random() * 4 + 14);

      if (isBomb) {
        flyingEntitiesRef.current.push({
          id: entityIdCounter.current,
          type: "bomb",
          x: startX,
          y: startY,
          vx,
          vy,
          rotation: 0,
          vRot: Math.random() * 0.08 - 0.04,
          radius: 34,
          sliced: false,
          fuseTick: 0,
        });
      } else {
        const fruitType =
          FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
        flyingEntitiesRef.current.push({
          id: entityIdCounter.current,
          type: "fruit",
          sub: fruitType,
          x: startX,
          y: startY,
          vx,
          vy,
          rotation: 0,
          vRot: Math.random() * 0.1 - 0.05,
          radius: fruitType.radius,
          sliced: false,
        });
      }
    }
  }, []);

  // Combo calculation
  const triggerComboIncrement = useCallback((hits: number) => {
    setCombo((prevCombo) => {
      const nextCombo = prevCombo + hits;
      setMaxCombo((prevMax) => Math.max(prevMax, nextCombo));

      if (nextCombo >= 3) {
        arcadeAudioEngine.playCombo();
        if (nextCombo % 3 === 0 && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          textPopupsRef.current.push({
            text: nextCombo >= 6 ? "JUICE FRENZY!" : "COMBO SLICE!",
            x: rect.width / 2,
            y: rect.height * 0.35,
            color: "#FF8A3D",
            scale: 1.8,
            vy: -1.5,
            life: 1.2,
          });
        }
      }
      return nextCombo;
    });

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, GAME_CONSTANTS.COMBO_TIMEOUT_MS);
  }, []);

  // Bomb exploded
  const handleBombExplosion = useCallback(
    (bomb: FlyingEntity) => {
      arcadeAudioEngine.playBomb();
      screenShakeRef.current = 18;

      // Burst bomb particles
      for (let i = 0; i < 30; i++) {
        juiceParticlesRef.current.push({
          x: bomb.x,
          y: bomb.y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          color: Math.random() > 0.5 ? "#1b1c1c" : "#FF3B30",
          size: Math.random() * 8 + 4,
          life: 1.0,
          decay: 0.02,
        });
      }

      if (modeRef.current === "blitz") {
        // Blitz Mode: No lives. Deduct 100 points with clear visual feedback
        setScore((prevScore) => Math.max(0, prevScore - 100));

        textPopupsRef.current.push({
          text: "-100 PTS! BOMB!",
          x: bomb.x,
          y: bomb.y - 20,
          color: "#ba1a1a",
          scale: 1.5,
          vy: -2,
          life: 1.1,
        });
      } else {
        // Classic Survival Mode: Deduct 1 life
        textPopupsRef.current.push({
          text: "BOOM! -1 HEART",
          x: bomb.x,
          y: bomb.y - 20,
          color: "#ba1a1a",
          scale: 1.4,
          vy: -2,
          life: 1.0,
        });

        setLives((prevLives) => {
          const next = Math.max(0, prevLives - 1);
          if (next <= 0) {
            setGameState("GAMEOVER");
          }
          return next;
        });
      }
    },
    []
  );

  // Fruit sliced
  const handleFruitSlice = useCallback(
    (fruit: FlyingEntity, p1: BladePoint, p2: BladePoint) => {
      if (!fruit.sub) return;
      const fruitSub = fruit.sub;

      setFruitsSliced((prev) => prev + 1);

      setCombo((current) => {
        const pts = fruitSub.points * Math.max(1, current + 1);
        setScore((prevScore) => prevScore + pts);

        // Comic popup
        textPopupsRef.current.push({
          text: `+${pts}`,
          x: fruit.x,
          y: fruit.y - 15,
          color: fruitSub.skin,
          scale: 1.2,
          vy: -2.5,
          life: 1.0,
        });
        return current;
      });

      // Spawn two halves
      const sliceAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const splitVx = Math.cos(sliceAngle + Math.PI / 2) * 4;
      const splitVy = Math.sin(sliceAngle + Math.PI / 2) * 4;

      entityIdCounter.current++;
      flyingEntitiesRef.current.push({
        id: entityIdCounter.current,
        type: "half",
        sub: fruitSub,
        side: -1,
        x: fruit.x - 5,
        y: fruit.y,
        vx: fruit.vx - splitVx,
        vy: fruit.vy - splitVy - 2,
        rotation: fruit.rotation,
        vRot: -0.1,
        radius: fruit.radius,
        sliceAngle,
        sliced: true,
      });

      entityIdCounter.current++;
      flyingEntitiesRef.current.push({
        id: entityIdCounter.current,
        type: "half",
        sub: fruitSub,
        side: 1,
        x: fruit.x + 5,
        y: fruit.y,
        vx: fruit.vx + splitVx,
        vy: fruit.vy + splitVy - 2,
        rotation: fruit.rotation,
        vRot: 0.1,
        radius: fruit.radius,
        sliceAngle,
        sliced: true,
      });

      // Juice splash
      for (let i = 0; i < 22; i++) {
        juiceParticlesRef.current.push({
          x: fruit.x,
          y: fruit.y,
          vx: (Math.random() - 0.5) * 10 + splitVx * 0.5,
          vy: (Math.random() - 0.5) * 10 - 2,
          color: fruitSub.flesh,
          size: Math.random() * 6 + 3,
          life: 1.0,
          decay: 0.025,
        });
      }
    },
    []
  );

  // Check blade collision
  const checkBladeCollisions = useCallback(
    (p1: BladePoint, p2: BladePoint) => {
      let hitsThisStroke = 0;

      for (let i = flyingEntitiesRef.current.length - 1; i >= 0; i--) {
        const ent = flyingEntitiesRef.current[i];
        if (ent.sliced) continue;

        if (lineIntersectsCircle(p1, p2, ent)) {
          ent.sliced = true;
          if (ent.type === "bomb") {
            handleBombExplosion(ent);
          } else if (ent.type === "fruit") {
            handleFruitSlice(ent, p1, p2);
            hitsThisStroke++;
          }
        }
      }

      if (hitsThisStroke > 0) {
        arcadeAudioEngine.playSwoosh();
        arcadeAudioEngine.playSplat();
        triggerComboIncrement(hitsThisStroke);
      }
    },
    [handleBombExplosion, handleFruitSlice, triggerComboIncrement]
  );

  // Blade event handlers
  const handleBladeStart = useCallback((clientX: number, clientY: number) => {
    arcadeAudioEngine.init();
    bladePointsRef.current = [];
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    bladePointsRef.current.push({
      x: clientX - rect.left,
      y: clientY - rect.top,
      life: 1.0,
    });
  }, []);

  const handleAddBladePoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const pt: BladePoint = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        life: 1.0,
      };

      bladePointsRef.current.push(pt);
      if (bladePointsRef.current.length > GAME_CONSTANTS.MAX_BLADE_POINTS) {
        bladePointsRef.current.shift();
      }

      if (bladePointsRef.current.length >= 2 && stateRef.current === "PLAYING") {
        checkBladeCollisions(
          bladePointsRef.current[bladePointsRef.current.length - 2],
          bladePointsRef.current[bladePointsRef.current.length - 1]
        );
      }
    },
    [checkBladeCollisions]
  );

  const handleBladeEnd = useCallback(() => {
    // End stroke
  }, []);

  // Start active play session
  const startActiveGame = useCallback(() => {
    setGameState("PLAYING");
    setScore(0);
    setLives(GAME_CONSTANTS.MAX_LIVES);
    setFruitsSliced(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeRemaining(GAME_CONSTANTS.BLITZ_DURATION);
    setSurvivalSeconds(0);

    flyingEntitiesRef.current = [];
    juiceParticlesRef.current = [];
    textPopupsRef.current = [];
    bladePointsRef.current = [];
    spawnTimerRef.current = 0;

    if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);

    gameClockIntervalRef.current = setInterval(() => {
      if (stateRef.current === "PLAYING") {
        if (modeRef.current === "blitz") {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              setGameState("GAMEOVER");
              return 0;
            }
            return prev - 1;
          });
        } else {
          setSurvivalSeconds((prev) => prev + 1);
        }
      }
    }, 1000);
  }, []);

  // Trigger countdown sequence
  const triggerCountdown = useCallback(() => {
    arcadeAudioEngine.init();
    setGameState("COUNTDOWN");
    let count = 3;
    setCountdownValue(count);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownValue(count);
      } else if (count === 0) {
        setCountdownValue("SLICE!");
      } else {
        clearInterval(timer);
        startActiveGame();
      }
    }, 700);
  }, [startActiveGame]);

  const togglePauseGame = useCallback(() => {
    setGameState((prev) => (prev === "PLAYING" ? "PAUSED" : "PLAYING"));
  }, []);

  const restartGame = useCallback(() => {
    triggerCountdown();
  }, [triggerCountdown]);

  const exitToHome = useCallback(() => {
    setGameState("START");
    if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);
  }, []);

  // Resize canvas handler
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Canvas resize and main 60 FPS animation loop
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Update simulation if PLAYING
      if (stateRef.current === "PLAYING") {
        spawnTimerRef.current++;
        if (spawnTimerRef.current >= GAME_CONSTANTS.BASE_SPAWN_INTERVAL) {
          spawnWave();
          spawnTimerRef.current = 0;
        }

        // Entities update
        for (let i = flyingEntitiesRef.current.length - 1; i >= 0; i--) {
          const ent = flyingEntitiesRef.current[i];
          ent.x += ent.vx;
          ent.y += ent.vy;
          ent.vy += GAME_CONSTANTS.GRAVITY;
          ent.rotation += ent.vRot;

          // Drop below viewport
          if (ent.y > height + 60) {
            if (!ent.sliced && ent.type === "fruit" && modeRef.current === "classic") {
              setLives((prevLives) => {
                const next = Math.max(0, prevLives - 1);
                if (next <= 0) {
                  setGameState("GAMEOVER");
                }
                return next;
              });

              textPopupsRef.current.push({
                text: "MISSED!",
                x: ent.x,
                y: height - 40,
                color: "#ba1a1a",
                scale: 1.0,
                vy: -1.5,
                life: 0.8,
              });
            }
            flyingEntitiesRef.current.splice(i, 1);
          }
        }

        // Juice particles update
        for (let i = juiceParticlesRef.current.length - 1; i >= 0; i--) {
          const p = juiceParticlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25;
          p.life -= p.decay;
          if (p.life <= 0) {
            juiceParticlesRef.current.splice(i, 1);
          }
        }

        // Text popups update
        for (let i = textPopupsRef.current.length - 1; i >= 0; i--) {
          const tp = textPopupsRef.current[i];
          tp.y += tp.vy;
          tp.life -= 0.02;
          if (tp.life <= 0) {
            textPopupsRef.current.splice(i, 1);
          }
        }

        // Blade points fade
        bladePointsRef.current.forEach((pt) => {
          pt.life -= 0.1;
        });
        bladePointsRef.current = bladePointsRef.current.filter((pt) => pt.life > 0);
      }

      // Render Canvas frame
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Screen shake
      if (screenShakeRef.current > 0) {
        const sx = (Math.random() - 0.5) * screenShakeRef.current;
        const sy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(sx, sy);
        screenShakeRef.current *= 0.88;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      // Draw entities
      flyingEntitiesRef.current.forEach((ent) => {
        ctx.save();
        ctx.translate(ent.x, ent.y);
        ctx.rotate(ent.rotation);

        if (ent.type === "fruit" && ent.sub) {
          drawCartoonFruit(ctx, ent.sub, ent.radius);
        } else if (ent.type === "bomb") {
          drawCartoonBomb(ctx, ent.radius);
        } else if (ent.type === "half" && ent.sub) {
          drawFruitHalf(ctx, ent.sub, ent.radius, ent.side);
        }
        ctx.restore();
      });

      // Draw juices
      drawJuiceParticles(ctx, juiceParticlesRef.current);

      // Draw blade trail
      drawBladeTrail(ctx, bladePointsRef.current, bladeThemeRef.current);

      // Draw text popups
      drawTextPopups(ctx, textPopupsRef.current);

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, [resizeCanvas, spawnWave]);

  return {
    canvasRef,
    gameState,
    gameMode,
    selectedBlade,
    countdownValue,
    score,
    lives,
    maxLives: GAME_CONSTANTS.MAX_LIVES,
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
    handleSoundToggle,
  };
};
