import { useState, useRef, useEffect, useCallback } from "react";
import type {
  GameMode,
  GameState,
  BladeTheme,
  FlyingEntity,
  JuiceParticle,
  TextPopup,
  BladePoint,
  ExplosionEffect,
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
  drawExplosions,
  drawZenAmbientAtmosphere,
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
  const [fruitsMissed, setFruitsMissed] = useState<number>(0);
  const [bombsHit, setBombsHit] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_CONSTANTS.ARCADE_DURATION);
  const [survivalSeconds, setSurvivalSeconds] = useState<number>(60);

  // Mutable refs for high-frequency 60 FPS animation (Rule 01 & Rule 02)
  const stateRef = useRef<GameState>("START");
  const modeRef = useRef<GameMode>("classic");
  const bladeThemeRef = useRef<BladeTheme>(BLADE_THEMES[0]);

  const flyingEntitiesRef = useRef<FlyingEntity[]>([]);
  const juiceParticlesRef = useRef<JuiceParticle[]>([]);
  const explosionsRef = useRef<ExplosionEffect[]>([]);
  const textPopupsRef = useRef<TextPopup[]>([]);
  const bladePointsRef = useRef<BladePoint[]>([]);
  const entityIdCounter = useRef(0);
  const animTickRef = useRef(0);

  const screenShakeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const comboRef = useRef<number>(0);
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
    gameMode === "arcade" || gameMode === "zen"
      ? formatTime(timeRemaining)
      : formatTime(survivalSeconds);

  // Spawning logic: mode-aware physics and pacing
  const spawnWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (modeRef.current === "zen") {
      // ── ZEN MODE SPAWNING: Slower, continuous, smoother movement, NO BOMBS! ──
      // Spawn 2 to 4 juicy fruits in a gentle arc allowing single-swipe slicing
      const count = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < count; i++) {
        entityIdCounter.current++;
        const fruitType = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
        const startX = Math.random() * (rect.width * 0.7) + rect.width * 0.15;
        const startY = rect.height + 40;

        const targetX = rect.width / 2 + (Math.random() * 360 - 180);
        // Slower horizontal velocity for relaxed tracking
        const vx = (targetX - startX) * 0.007 + (Math.random() * 1.4 - 0.7);

        // Zen smooth float height: peaks inside canvas between 66% and 86% of height
        const targetLaunchHeight = (rect.height + 40) * (0.66 + Math.random() * 0.20);
        const vy = -Math.sqrt(2 * GAME_CONSTANTS.ZEN_GRAVITY * targetLaunchHeight);

        flyingEntitiesRef.current.push({
          id: entityIdCounter.current,
          type: "fruit",
          sub: fruitType,
          x: startX,
          y: startY,
          vx,
          vy,
          rotation: Math.random() * Math.PI,
          vRot: Math.random() * 0.04 - 0.02, // Gentle graceful rotation
          radius: fruitType.radius,
          sliced: false,
        });
      }
      return;
    }

    // ── CLASSIC & ARCADE SPAWNING ──
    const currentScore = scoreRef.current;
    const currentCombo = comboRef.current;
    const scoreFactor = Math.min(1, currentScore / 1000);
    const comboFactor = Math.min(0.4, currentCombo * 0.04);
    const difficultyLevel = Math.min(1.2, scoreFactor + comboFactor);

    // Bomb Probability increases a little with score & combo
    const dynamicBombChance = Math.min(
      GAME_CONSTANTS.MAX_BOMB_CHANCE,
      GAME_CONSTANTS.BOMB_CHANCE + difficultyLevel * (GAME_CONSTANTS.MAX_BOMB_CHANCE - GAME_CONSTANTS.BOMB_CHANCE)
    );

    const maxItems = difficultyLevel > 0.6 ? 4 : 3;
    const count = Math.floor(Math.random() * (maxItems - 1 + 1)) + 1;

    for (let i = 0; i < count; i++) {
      entityIdCounter.current++;
      const isBomb = Math.random() < dynamicBombChance;
      const startX = Math.random() * (rect.width * 0.7) + rect.width * 0.15;
      const startY = rect.height + 40;

      const targetX = rect.width / 2 + (Math.random() * 300 - 150);
      const vx = (targetX - startX) * 0.012 + (Math.random() * 2 - 1);

      const targetLaunchHeight = (rect.height + 40) * (0.65 + Math.random() * 0.18);
      const vy = -Math.sqrt(2 * GAME_CONSTANTS.GRAVITY * targetLaunchHeight);

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

  // Combo calculation (zen subtle cues vs arcade score multipliers)
  const triggerComboIncrement = useCallback((hits: number) => {
    const isZen = modeRef.current === "zen";

    setCombo((prevCombo) => {
      const nextCombo = prevCombo + hits;
      comboRef.current = nextCombo;
      setMaxCombo((prevMax) => Math.max(prevMax, nextCombo));

      if (nextCombo >= 2) {
        arcadeAudioEngine.playCombo(isZen);
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          let comboTitle = isZen ? `🌸 ${nextCombo}× SLICE` : `+${hits} COMBO!`;
          let comboColor = isZen ? "#34D399" : "#FF8A3D";
          let comboScale = isZen ? 1.4 : 1.6;

          if (isZen) {
            // Serene Zen combo titles without points
            if (nextCombo >= 8) {
              comboTitle = "🧘 ZEN MASTER 🧘";
              comboColor = "#FBBF24";
              comboScale = 1.85;
            } else if (nextCombo >= 6) {
              comboTitle = "🌊 HARMONY STRIKE 🌊";
              comboColor = "#38BDF8";
              comboScale = 1.7;
            } else if (nextCombo >= 4) {
              comboTitle = "🍃 TRANQUIL FLOW 🍃";
              comboColor = "#10B981";
              comboScale = 1.6;
            } else if (nextCombo >= 2) {
              comboTitle = "✨ SERENE COMBO ✨";
              comboColor = "#34D399";
              comboScale = 1.45;
            }
          } else {
            if (nextCombo >= 10) {
              comboTitle = "⚡ GODLIKE BLADE! ⚡";
              comboColor = "#FFD84D";
              comboScale = 2.4;
            } else if (nextCombo >= 7) {
              comboTitle = "🔥 UNSTOPPABLE! 🔥";
              comboColor = "#FF3B30";
              comboScale = 2.1;
            } else if (nextCombo >= 5) {
              comboTitle = "💥 MEGA SLICE! 💥";
              comboColor = "#fe893c";
              comboScale = 1.9;
            } else if (nextCombo >= 3) {
              comboTitle = "★ COMBO SLICE! ★";
              comboColor = "#5CB85C";
              comboScale = 1.7;
            }
          }

          // Remove previous combo popups
          textPopupsRef.current = textPopupsRef.current.filter(
            (tp) =>
              !tp.text.includes("COMBO") &&
              !tp.text.includes("UNSTOPPABLE") &&
              !tp.text.includes("GODLIKE") &&
              !tp.text.includes("MEGA SLICE") &&
              !tp.text.includes("ZEN") &&
              !tp.text.includes("FLOW") &&
              !tp.text.includes("HARMONY") &&
              !tp.text.includes("SLICE")
          );

          textPopupsRef.current.push({
            text: comboTitle,
            x: rect.width / 2,
            y: rect.height * 0.35,
            color: comboColor,
            scale: comboScale,
            vy: isZen ? -1.0 : -1.6,
            life: isZen ? 1.4 : 1.2,
          });
        }
      }
      return nextCombo;
    });

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    const timeoutMs = isZen
      ? GAME_CONSTANTS.ZEN_COMBO_TIMEOUT_MS
      : GAME_CONSTANTS.COMBO_TIMEOUT_MS;

    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
      comboRef.current = 0;
    }, timeoutMs);
  }, []);

  // Bomb exploded (Classic / Arcade only)
  const handleBombExplosion = useCallback(
    (bomb: FlyingEntity) => {
      arcadeAudioEngine.playBomb();
      screenShakeRef.current = 18;
      setBombsHit((prev) => prev + 1);

      const sparkColors = ["#FFD84D", "#FF8A3D", "#FF3B30", "#FFFFFF", "#1b1c1c"];
      const sparks = Array.from({ length: 24 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 70 + 40;
        return {
          vx: Math.cos(angle),
          vy: Math.sin(angle),
          size: Math.random() * 5 + 3,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          distance: speed,
        };
      });

      const smokeColors = ["#4A4A4A", "#2E2E2E", "#1b1c1c", "#6B6B6B"];
      const smoke = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8 + (Math.random() * 0.4 - 0.2);
        const dist = Math.random() * 20 + 15;
        return {
          xOffset: Math.cos(angle) * dist,
          yOffset: Math.sin(angle) * dist,
          size: Math.random() * 14 + 16,
          color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
          rotation: Math.random() * Math.PI,
        };
      });

      explosionsRef.current.push({
        x: bomb.x,
        y: bomb.y,
        progress: 0,
        maxRadius: 75,
        sparks,
        smoke,
      });

      const bombIndex = flyingEntitiesRef.current.indexOf(bomb);
      if (bombIndex !== -1) {
        flyingEntitiesRef.current.splice(bombIndex, 1);
      }

      if (modeRef.current === "arcade") {
        setScore((prevScore) => {
          const nextScore = Math.max(0, prevScore - 100);
          scoreRef.current = nextScore;
          return nextScore;
        });

        textPopupsRef.current.push({
          text: "-100 PTS! BOMB!",
          x: bomb.x,
          y: bomb.y - 20,
          color: "#ba1a1a",
          scale: 1.5,
          vy: -2,
          life: 1.1,
        });
      } else if (modeRef.current === "classic") {
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
            arcadeAudioEngine.stopBackgroundMusic();
            setGameState("GAMEOVER");
          }
          return next;
        });
      }
    },
    []
  );

  // Fruit sliced handler
  const handleFruitSlice = useCallback(
    (fruit: FlyingEntity, p1: BladePoint, p2: BladePoint) => {
      if (!fruit.sub) return;
      const fruitSub = fruit.sub;
      const isZen = modeRef.current === "zen";

      setFruitsSliced((prev) => prev + 1);

      // Only scored modes award score and show point popups
      if (!isZen) {
        setCombo((current) => {
          const pts = Math.min(50, fruitSub.points * Math.max(1, current + 1));
          setScore((prevScore) => {
            const nextScore = prevScore + pts;
            scoreRef.current = nextScore;
            return nextScore;
          });

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
      }

      // Remove the original sliced fruit
      const fruitIndex = flyingEntitiesRef.current.indexOf(fruit);
      if (fruitIndex !== -1) {
        flyingEntitiesRef.current.splice(fruitIndex, 1);
      }

      // Spawn two halves with smooth physical arc
      const sliceAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const splitSpeed = isZen ? 2.6 : 4;
      const splitVx = Math.cos(sliceAngle + Math.PI / 2) * splitSpeed;
      const splitVy = Math.sin(sliceAngle + Math.PI / 2) * splitSpeed;

      entityIdCounter.current++;
      flyingEntitiesRef.current.push({
        id: entityIdCounter.current,
        type: "half",
        sub: fruitSub,
        side: -1,
        x: fruit.x - 5,
        y: fruit.y,
        vx: fruit.vx - splitVx,
        vy: fruit.vy - splitVy - (isZen ? 1.2 : 2),
        rotation: fruit.rotation,
        vRot: isZen ? -0.05 : -0.1,
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
        vy: fruit.vy - splitVy - (isZen ? 1.2 : 2),
        rotation: fruit.rotation,
        vRot: isZen ? 0.05 : 0.1,
        radius: fruit.radius,
        sliceAngle,
        sliced: true,
      });

      // Juice splash (satisfying juicy splash particles)
      const particleCount = isZen ? 24 : 22;
      for (let i = 0; i < particleCount; i++) {
        juiceParticlesRef.current.push({
          x: fruit.x,
          y: fruit.y,
          vx: (Math.random() - 0.5) * (isZen ? 8 : 10) + splitVx * 0.4,
          vy: (Math.random() - 0.5) * (isZen ? 8 : 10) - (isZen ? 1.5 : 2),
          color: fruitSub.flesh,
          size: Math.random() * (isZen ? 6 : 6) + 3,
          life: 1.0,
          decay: isZen ? 0.016 : 0.025,
        });
      }
    },
    []
  );

  // Check blade collision along stroke (supports multi-fruit slice in single swipe)
  const checkBladeCollisions = useCallback(
    (p1: BladePoint, p2: BladePoint) => {
      const isZen = modeRef.current === "zen";
      let hitsThisStroke = 0;

      for (let i = flyingEntitiesRef.current.length - 1; i >= 0; i--) {
        const ent = flyingEntitiesRef.current[i];
        if (ent.sliced) continue;

        if (lineIntersectsCircle(p1, p2, ent)) {
          ent.sliced = true;
          if (ent.type === "bomb") {
            if (!isZen) {
              handleBombExplosion(ent);
            }
          } else if (ent.type === "fruit") {
            handleFruitSlice(ent, p1, p2);
            hitsThisStroke++;
          }
        }
      }

      if (hitsThisStroke > 0) {
        arcadeAudioEngine.playSwoosh(isZen);
        arcadeAudioEngine.playSplat(isZen);
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
    const isZen = modeRef.current === "zen";

    setGameState("PLAYING");
    setScore(0);
    setLives(GAME_CONSTANTS.MAX_LIVES);
    setFruitsSliced(0);
    setFruitsMissed(0);
    setBombsHit(0);
    setCombo(0);
    setMaxCombo(0);

    const initialTime = isZen ? GAME_CONSTANTS.ZEN_DURATION : GAME_CONSTANTS.ARCADE_DURATION;
    setTimeRemaining(initialTime);
    setSurvivalSeconds(0);

    flyingEntitiesRef.current = [];
    juiceParticlesRef.current = [];
    explosionsRef.current = [];
    textPopupsRef.current = [];
    bladePointsRef.current = [];
    spawnTimerRef.current = 0;

    // Start mode-appropriate background music
    arcadeAudioEngine.startBackgroundMusic(modeRef.current);

    if (gameClockIntervalRef.current) clearInterval(gameClockIntervalRef.current);

    gameClockIntervalRef.current = setInterval(() => {
      if (stateRef.current === "PLAYING") {
        if (modeRef.current === "arcade" || modeRef.current === "zen") {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              arcadeAudioEngine.stopBackgroundMusic();
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
    setGameState((prev) => {
      if (prev === "PLAYING") {
        arcadeAudioEngine.stopBackgroundMusic();
        return "PAUSED";
      } else if (prev === "PAUSED") {
        arcadeAudioEngine.startBackgroundMusic(modeRef.current);
        return "PLAYING";
      }
      return prev;
    });
  }, []);

  const restartGame = useCallback(() => {
    triggerCountdown();
  }, [triggerCountdown]);

  const exitToHome = useCallback(() => {
    arcadeAudioEngine.stopBackgroundMusic();
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

      const isZen = modeRef.current === "zen";
      const gravity = isZen ? GAME_CONSTANTS.ZEN_GRAVITY : GAME_CONSTANTS.GRAVITY;
      const spawnInterval = isZen
        ? GAME_CONSTANTS.ZEN_SPAWN_INTERVAL
        : GAME_CONSTANTS.BASE_SPAWN_INTERVAL;

      // Update simulation if PLAYING
      if (stateRef.current === "PLAYING") {
        spawnTimerRef.current++;
        if (spawnTimerRef.current >= spawnInterval) {
          spawnWave();
          spawnTimerRef.current = 0;
        }

        // Entities update
        for (let i = flyingEntitiesRef.current.length - 1; i >= 0; i--) {
          const ent = flyingEntitiesRef.current[i];
          ent.x += ent.vx;
          ent.y += ent.vy;
          ent.vy += gravity;
          ent.rotation += ent.vRot;

          // Drop below viewport
          if (ent.y > height + 60) {
            if (!ent.sliced && ent.type === "fruit") {
              setFruitsMissed((prev) => prev + 1);

              if (modeRef.current === "classic") {
                setLives((prevLives) => {
                  const next = Math.max(0, prevLives - 1);
                  if (next <= 0) {
                    arcadeAudioEngine.stopBackgroundMusic();
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
              // Zen mode: No penalties, no lives lost, no popups for missed fruits!
            }
            flyingEntitiesRef.current.splice(i, 1);
          }
        }

        // Juice particles update
        for (let i = juiceParticlesRef.current.length - 1; i >= 0; i--) {
          const p = juiceParticlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += isZen ? 0.14 : 0.25;
          p.life -= p.decay;
          if (p.life <= 0) {
            juiceParticlesRef.current.splice(i, 1);
          }
        }

        // Explosions update (only in classic/arcade)
        for (let i = explosionsRef.current.length - 1; i >= 0; i--) {
          const exp = explosionsRef.current[i];
          exp.progress += 1 / 60;
          if (exp.progress >= 1.0) {
            explosionsRef.current.splice(i, 1);
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

      // Screen shake (disabled in calm Zen mode)
      if (screenShakeRef.current > 0 && !isZen) {
        const sx = (Math.random() - 0.5) * screenShakeRef.current;
        const sy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(sx, sy);
        screenShakeRef.current *= 0.88;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      // Subtle ambient Zen atmosphere (floating petals & luminous orbs)
      if (isZen) {
        animTickRef.current = (animTickRef.current || 0) + 1;
        drawZenAmbientAtmosphere(ctx, width, height, animTickRef.current);
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

      // Draw explosions (bombs)
      if (!isZen) {
        drawExplosions(ctx, explosionsRef.current);
      }

      // Draw smooth blade trail (Zen mode passes true for radiant glowing pastel ribbon)
      drawBladeTrail(ctx, bladePointsRef.current, bladeThemeRef.current, isZen);

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
      arcadeAudioEngine.stopBackgroundMusic();
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
    fruitsMissed,
    bombsHit,
    combo,
    maxCombo,
    survivalSeconds,
    timeRemaining,
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
