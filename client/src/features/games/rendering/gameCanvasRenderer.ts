import type {
  FruitTypeConfig,
  JuiceParticle,
  TextPopup,
  BladePoint,
  BladeTheme,
  ExplosionEffect,
} from "../config/game.types";

/**
 * Cartoon Drawing Helpers with Bold Black Ink Outlines
 */

// ─────────────────────────────────────────────────────────────
// 1. CARTOON FRUIT RENDERER — Unique Silhouettes for Every Fruit
// ─────────────────────────────────────────────────────────────

export function drawCartoonFruit(
  ctx: CanvasRenderingContext2D,
  sub: FruitTypeConfig,
  r: number
) {
  ctx.save();

  const ink = "#1B1C1C";
  const white = "rgba(255,255,255,0.55)";

  // Consistent proportions at every fruit size
  const line = Math.max(2, r * 0.075);
  const shadowOffset = r * 0.12;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const drawShadow = () => {
    ctx.save();
    ctx.translate(shadowOffset, shadowOffset);
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.95;
  };

  const finishShadow = () => {
    ctx.restore();
  };

  const outline = () => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = line;
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  switch (sub.shape) {
    // ─────────────────────────────────────────────
    // APPLE
    // ─────────────────────────────────────────────
    case "apple": {
      // Shadow
      drawShadow();

      ctx.beginPath();
      ctx.moveTo(0, -r * 0.18);
      ctx.bezierCurveTo(
        r * 0.25,
        -r * 0.72,
        r * 0.9,
        -r * 0.62,
        r * 0.92,
        -r * 0.02
      );
      ctx.bezierCurveTo(
        r * 0.95,
        r * 0.55,
        r * 0.55,
        r * 0.95,
        0,
        r
      );
      ctx.bezierCurveTo(
        -r * 0.55,
        r * 0.95,
        -r * 0.95,
        r * 0.55,
        -r * 0.92,
        -r * 0.02
      );
      ctx.bezierCurveTo(
        -r * 0.9,
        -r * 0.62,
        -r * 0.25,
        -r * 0.72,
        0,
        -r * 0.18
      );
      ctx.fill();
      finishShadow();

      // Body
      ctx.fillStyle = sub.skin;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.18);
      ctx.bezierCurveTo(
        r * 0.25,
        -r * 0.72,
        r * 0.9,
        -r * 0.62,
        r * 0.92,
        -r * 0.02
      );
      ctx.bezierCurveTo(
        r * 0.95,
        r * 0.55,
        r * 0.55,
        r * 0.95,
        0,
        r
      );
      ctx.bezierCurveTo(
        -r * 0.55,
        r * 0.95,
        -r * 0.95,
        r * 0.55,
        -r * 0.92,
        -r * 0.02
      );
      ctx.bezierCurveTo(
        -r * 0.9,
        -r * 0.62,
        -r * 0.25,
        -r * 0.72,
        0,
        -r * 0.18
      );
      ctx.fill();
      outline();

      // Stem
      ctx.strokeStyle = "#6B4423";
      ctx.lineWidth = line * 1.15;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.18);
      ctx.quadraticCurveTo(
        r * 0.02,
        -r * 0.48,
        r * 0.16,
        -r * 0.68
      );
      ctx.stroke();

      // Leaf
      ctx.fillStyle = "#34C759";
      ctx.beginPath();
      ctx.ellipse(
        r * 0.25,
        -r * 0.58,
        r * 0.25,
        r * 0.11,
        -0.35,
        0,
        Math.PI * 2
      );
      ctx.fill();
      outline();

      // Shine
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.ellipse(
        -r * 0.38,
        -r * 0.28,
        r * 0.13,
        r * 0.22,
        -0.45,
        0,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // ─────────────────────────────────────────────
    // ORANGE
    // ─────────────────────────────────────────────
    case "orange": {
      drawShadow();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      finishShadow();

      ctx.fillStyle = sub.skin;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      outline();

      // Peel texture
      ctx.fillStyle = "#D46B08";

      for (let i = 0; i < 22; i++) {
        const angle = i * 2.39996;
        const distance = r * (0.18 + ((i % 5) / 5) * 0.62);

        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance,
          Math.max(1, r * 0.025),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Leaf
      ctx.fillStyle = "#34C759";
      ctx.beginPath();
      ctx.ellipse(
        r * 0.18,
        -r * 0.87,
        r * 0.24,
        r * 0.1,
        -0.35,
        0,
        Math.PI * 2
      );
      ctx.fill();
      outline();

      // Shine
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.ellipse(
        -r * 0.34,
        -r * 0.34,
        r * 0.17,
        r * 0.24,
        -0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // ─────────────────────────────────────────────
    // WATERMELON
    // ─────────────────────────────────────────────
    case "watermelon": {
      drawShadow();

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.02, r * 0.86, 0, 0, Math.PI * 2);
      ctx.fill();
      finishShadow();

      // Rind
      ctx.fillStyle = sub.skin;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.02, r * 0.86, 0, 0, Math.PI * 2);
      ctx.fill();
      outline();

      // Stripes clipped inside fruit
      ctx.save();

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.98, r * 0.82, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = "#165B33";
      ctx.lineWidth = r * 0.14;

      for (let i = -2; i <= 2; i++) {
        const x = i * r * 0.38;

        ctx.beginPath();
        ctx.moveTo(x - r * 0.18, -r);
        ctx.quadraticCurveTo(
          x + r * 0.2,
          0,
          x - r * 0.18,
          r
        );
        ctx.stroke();
      }

      ctx.restore();

      // Shine
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.ellipse(
        -r * 0.4,
        -r * 0.32,
        r * 0.18,
        r * 0.12,
        -0.45,
        0,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // ─────────────────────────────────────────────
    // PINEAPPLE
    // ─────────────────────────────────────────────
  case "pineapple": {
  const darkGreen = "#176B3A";
  const leafGreen = "#2F9E55";
  const lightGreen = "#55B86A";
  const diamondColor = "#A86518";

  // ─────────────────────────────────────────────
  // CROWN / LEAVES
  // ─────────────────────────────────────────────

  ctx.save();

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const leaves = [
    { x: -0.42, h: 0.62, rot: -0.42 },
    { x: -0.25, h: 0.82, rot: -0.28 },
    { x: -0.08, h: 0.96, rot: -0.12 },
    { x: 0.08, h: 1.0, rot: 0.08 },
    { x: 0.25, h: 0.82, rot: 0.27 },
    { x: 0.42, h: 0.62, rot: 0.42 },
  ];

  leaves.forEach((leaf, index) => {
    ctx.save();

    ctx.translate(
      r * leaf.x,
      -r * 0.68
    );

    ctx.rotate(leaf.rot);

    ctx.beginPath();

    ctx.moveTo(0, r * 0.12);

    ctx.bezierCurveTo(
      -r * 0.13,
      -r * leaf.h * 0.45,
      -r * 0.13,
      -r * leaf.h * 0.82,
      0,
      -r * leaf.h
    );

    ctx.bezierCurveTo(
      r * 0.13,
      -r * leaf.h * 0.78,
      r * 0.13,
      -r * leaf.h * 0.35,
      0,
      r * 0.12
    );

    ctx.closePath();

    ctx.fillStyle =
      index % 2 === 0
        ? darkGreen
        : leafGreen;

    ctx.fill();

    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1.5, r * 0.055);
    ctx.stroke();

    // Leaf highlight
    ctx.strokeStyle = lightGreen;
    ctx.lineWidth = Math.max(1, r * 0.025);

    ctx.beginPath();
    ctx.moveTo(0, r * 0.02);
    ctx.quadraticCurveTo(
      0,
      -r * leaf.h * 0.45,
      0,
      -r * leaf.h * 0.82
    );
    ctx.stroke();

    ctx.restore();
  });

  ctx.restore();

  // ─────────────────────────────────────────────
  // BODY SHADOW
  // ─────────────────────────────────────────────

  drawShadow();

  ctx.beginPath();

  ctx.moveTo(
    -r * 0.58,
    -r * 0.48
  );

  ctx.bezierCurveTo(
    -r * 0.82,
    -r * 0.12,
    -r * 0.72,
    r * 0.62,
    -r * 0.32,
    r * 0.94
  );

  ctx.bezierCurveTo(
    -r * 0.12,
    r * 1.08,
    r * 0.12,
    r * 1.08,
    r * 0.32,
    r * 0.94
  );

  ctx.bezierCurveTo(
    r * 0.72,
    r * 0.62,
    r * 0.82,
    -r * 0.12,
    r * 0.58,
    -r * 0.48
  );

  ctx.closePath();

  ctx.fill();

  finishShadow();

  // ─────────────────────────────────────────────
  // PINEAPPLE BODY
  // ─────────────────────────────────────────────

  ctx.fillStyle = sub.skin;

  ctx.beginPath();

  ctx.moveTo(
    -r * 0.58,
    -r * 0.48
  );

  ctx.bezierCurveTo(
    -r * 0.82,
    -r * 0.12,
    -r * 0.72,
    r * 0.62,
    -r * 0.32,
    r * 0.94
  );

  ctx.bezierCurveTo(
    -r * 0.12,
    r * 1.08,
    r * 0.12,
    r * 1.08,
    r * 0.32,
    r * 0.94
  );

  ctx.bezierCurveTo(
    r * 0.72,
    r * 0.62,
    r * 0.82,
    -r * 0.12,
    r * 0.58,
    -r * 0.48
  );

  ctx.closePath();

  ctx.fill();

  outline();

  // ─────────────────────────────────────────────
  // DIAMOND TEXTURE
  // ─────────────────────────────────────────────

  ctx.save();

  ctx.beginPath();

  ctx.moveTo(
    -r * 0.55,
    -r * 0.42
  );

  ctx.bezierCurveTo(
    -r * 0.72,
    0,
    -r * 0.6,
    r * 0.55,
    -r * 0.28,
    r * 0.88
  );

  ctx.bezierCurveTo(
    0,
    r * 1.0,
    r * 0.28,
    r * 0.9,
    r * 0.58,
    r * 0.45
  );

  ctx.bezierCurveTo(
    r * 0.7,
    0,
    r * 0.65,
    -r * 0.35,
    r * 0.55,
    -r * 0.42
  );

  ctx.closePath();

  ctx.clip();

  ctx.strokeStyle = diamondColor;
  ctx.lineWidth = Math.max(1.5, r * 0.045);
  ctx.lineCap = "round";

  const spacing = r * 0.27;

  // Diagonal lines
  for (
    let offset = -r * 1.5;
    offset <= r * 1.5;
    offset += spacing
  ) {
    ctx.beginPath();

    ctx.moveTo(
      -r * 1.2,
      offset
    );

    ctx.lineTo(
      r * 1.2,
      offset + r * 1.1
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
      r * 1.2,
      offset
    );

    ctx.lineTo(
      -r * 1.2,
      offset + r * 1.1
    );

    ctx.stroke();
  }

  ctx.restore();

  // ─────────────────────────────────────────────
  // DIAMOND CENTERS
  // ─────────────────────────────────────────────

  ctx.fillStyle = "#7D4A13";

  const dots = [
    [-0.28, -0.28],
    [0, -0.38],
    [0.28, -0.25],

    [-0.42, 0],
    [-0.14, -0.02],
    [0.14, 0.02],
    [0.42, 0.02],

    [-0.28, 0.28],
    [0, 0.35],
    [0.28, 0.3],

    [-0.14, 0.58],
    [0.14, 0.58],
  ];

  dots.forEach(([x, y]) => {
    ctx.beginPath();

    ctx.arc(
      r * x,
      r * y,
      Math.max(1.2, r * 0.025),
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  // ─────────────────────────────────────────────
  // JUICY HIGHLIGHT
  // ─────────────────────────────────────────────

  ctx.fillStyle = white;

  ctx.beginPath();

  ctx.ellipse(
    -r * 0.32,
    -r * 0.22,
    r * 0.11,
    r * 0.22,
    -0.45,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // Small secondary highlight
  ctx.globalAlpha = 0.35;

  ctx.beginPath();

  ctx.arc(
    -r * 0.15,
    -r * 0.48,
    r * 0.055,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.globalAlpha = 1;

  break;
}

    // ─────────────────────────────────────────────
    // STRAWBERRY
    // ─────────────────────────────────────────────
    case "strawberry": {
      drawShadow();

      ctx.beginPath();
      ctx.moveTo(0, -r * 0.58);
      ctx.bezierCurveTo(
        r * 0.95,
        -r * 0.52,
        r * 0.88,
        r * 0.45,
        0,
        r * 1.02
      );
      ctx.bezierCurveTo(
        -r * 0.88,
        r * 0.45,
        -r * 0.95,
        -r * 0.52,
        0,
        -r * 0.58
      );
      ctx.fill();
      finishShadow();

      // Body
      ctx.fillStyle = sub.skin;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.58);
      ctx.bezierCurveTo(
        r * 0.95,
        -r * 0.52,
        r * 0.88,
        r * 0.45,
        0,
        r * 1.02
      );
      ctx.bezierCurveTo(
        -r * 0.88,
        r * 0.45,
        -r * 0.95,
        -r * 0.52,
        0,
        -r * 0.58
      );
      ctx.fill();
      outline();

      // Seeds
      ctx.fillStyle = "#FFD84D";

      const seedRows = [-0.25, 0.05, 0.35, 0.62];

      seedRows.forEach((row, rowIndex) => {
        const count = rowIndex === 0 ? 3 : rowIndex === 1 ? 4 : 5;

        for (let i = 0; i < count; i++) {
          const x =
            (i - (count - 1) / 2) * r * 0.27;

          const y = r * row;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(0.2);

          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            Math.max(1, r * 0.025),
            Math.max(1.5, r * 0.045),
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.restore();
        }
      });

      // Crown
      ctx.fillStyle = "#34C759";
      ctx.beginPath();

      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(r * 0.4, -r * 0.85);
      ctx.lineTo(r * 0.18, -r * 0.5);
      ctx.lineTo(0, -r * 0.98);
      ctx.lineTo(-r * 0.18, -r * 0.5);
      ctx.lineTo(-r * 0.4, -r * 0.85);
      ctx.closePath();

      ctx.fill();
      outline();

      // Shine
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.ellipse(
        -r * 0.3,
        -r * 0.25,
        r * 0.1,
        r * 0.18,
        -0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // ─────────────────────────────────────────────
    // KIWI
    // ─────────────────────────────────────────────
    case "kiwi": {
      drawShadow();

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.94, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      finishShadow();

      ctx.fillStyle = sub.skin;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.94, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      outline();

      // Fuzzy texture
      ctx.fillStyle = "#5E381A";

      for (let i = 0; i < 28; i++) {
        const angle = i * 2.39996;
        const distance = r * (0.38 + (i % 4) * 0.12);

        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance * 0.85,
          Math.max(0.8, r * 0.018),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.ellipse(
        -r * 0.35,
        -r * 0.28,
        r * 0.14,
        r * 0.1,
        -0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // ─────────────────────────────────────────────
    // BANANA
    // ─────────────────────────────────────────────
case "banana": {
  const bananaYellow = sub.skin || "#F7C928";
  const bananaLight = "#FFE477";
  const bananaDark = "#D39A16";

  // ─────────────────────────────────────────────
  // BANANA SHAPE
  // Wide + slightly curved, not overly bent
  // ─────────────────────────────────────────────

  const drawBananaPath = () => {
    ctx.beginPath();

    // Top-left
    ctx.moveTo(-r * 0.78, -r * 0.35);

    // Top edge
    ctx.bezierCurveTo(
      -r * 0.35,
      -r * 0.58,
      r * 0.35,
      -r * 0.55,
      r * 0.72,
      -r * 0.28
    );

    // Right tip
    ctx.bezierCurveTo(
      r * 0.84,
      -r * 0.18,
      r * 0.86,
      -r * 0.02,
      r * 0.76,
      r * 0.08
    );

    // Bottom-right
    ctx.bezierCurveTo(
      r * 0.62,
      r * 0.22,
      r * 0.35,
      r * 0.38,
      r * 0.02,
      r * 0.4
    );

    // Bottom-left
    ctx.bezierCurveTo(
      -r * 0.35,
      r * 0.42,
      -r * 0.65,
      r * 0.3,
      -r * 0.82,
      r * 0.05
    );

    // Left tip
    ctx.bezierCurveTo(
      -r * 0.9,
      -r * 0.05,
      -r * 0.88,
      -r * 0.22,
      -r * 0.78,
      -r * 0.35
    );

    ctx.closePath();
  };

  // ─────────────────────────────────────────────
  // SHADOW
  // ─────────────────────────────────────────────

  ctx.save();

  ctx.translate(
    r * 0.08,
    r * 0.1
  );

  drawBananaPath();

  ctx.fillStyle = ink;
  ctx.fill();

  ctx.restore();

  // ─────────────────────────────────────────────
  // BODY
  // ─────────────────────────────────────────────

  drawBananaPath();

  ctx.fillStyle = bananaYellow;

  ctx.fill();

  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(
    2,
    r * 0.075
  );

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.stroke();

  // ─────────────────────────────────────────────
  // INNER RIDGE
  // ─────────────────────────────────────────────

  ctx.strokeStyle = bananaDark;

  ctx.lineWidth = Math.max(
    1.5,
    r * 0.045
  );

  ctx.beginPath();

  ctx.moveTo(
    -r * 0.65,
    -r * 0.18
  );

  ctx.bezierCurveTo(
    -r * 0.2,
    -r * 0.38,
    r * 0.3,
    -r * 0.32,
    r * 0.58,
    -r * 0.12
  );

  ctx.stroke();

  // ─────────────────────────────────────────────
  // TOP TIP
  // Yellow / brown only
  // NO GREEN
  // ─────────────────────────────────────────────

  ctx.fillStyle = bananaDark;

  ctx.beginPath();

  ctx.roundRect(
    -r * 0.83,
    -r * 0.39,
    r * 0.14,
    r * 0.16,
    r * 0.04
  );

  ctx.fill();

  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(
    1.5,
    r * 0.045
  );

  ctx.stroke();

  // ─────────────────────────────────────────────
  // RIGHT TIP
  // ─────────────────────────────────────────────

  ctx.fillStyle = "#6A4515";

  ctx.beginPath();

  ctx.ellipse(
    r * 0.78,
    -r * 0.02,
    r * 0.055,
    r * 0.08,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // ─────────────────────────────────────────────
  // MAIN HIGHLIGHT
  // ─────────────────────────────────────────────

  ctx.fillStyle = bananaLight;

  ctx.globalAlpha = 0.8;

  ctx.beginPath();

  ctx.ellipse(
    -r * 0.22,
    -r * 0.3,
    r * 0.08,
    r * 0.25,
    -0.2,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.globalAlpha = 1;

  // Small shine
  ctx.fillStyle = white;

  ctx.beginPath();

  ctx.ellipse(
    -r * 0.08,
    -r * 0.32,
    r * 0.045,
    r * 0.11,
    -0.3,
    0,
    Math.PI * 2
  );

  ctx.fill();

  break;
}

    default: {
      // Generic fruit fallback
      drawShadow();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      finishShadow();

      ctx.fillStyle = sub.skin;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      outline();

      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.arc(
        -r * 0.3,
        -r * 0.3,
        r * 0.16,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// 2. CARTOON SLICED HALF RENDERER — Cross Section with Details
// ─────────────────────────────────────────────────────────────

export function drawFruitHalf(
  ctx: CanvasRenderingContext2D,
  sub: FruitTypeConfig,
  r: number,
  side: number = 1
) {
  ctx.save();

  const ink = "#1B1C1C";
  const white = "rgba(255,255,255,0.5)";
  const line = Math.max(2, r * 0.075);

  ctx.scale(side, 1);

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // ─────────────────────────────────────────────
  // Helper: half-circle
  // ─────────────────────────────────────────────

  const drawHalfShape = (
    radius: number,
    fill: string,
    offsetX = 0,
    offsetY = 0
  ) => {
    ctx.beginPath();

    ctx.arc(
      offsetX,
      offsetY,
      radius,
      -Math.PI / 2,
      Math.PI / 2
    );

    ctx.lineTo(offsetX, offsetY - radius);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = ink;
    ctx.lineWidth = line;
    ctx.stroke();
  };

  // ─────────────────────────────────────────────
  // Outer dark extrusion
  // ─────────────────────────────────────────────

  ctx.save();
  ctx.translate(r * 0.1, r * 0.1);

  drawHalfShape(r * 0.96, ink);

  ctx.restore();

  // ─────────────────────────────────────────────
  // Fruit-specific outer body
  // ─────────────────────────────────────────────

  drawHalfShape(r * 0.96, sub.skin);

  // ─────────────────────────────────────────────
  // JUICY FLESH
  // ─────────────────────────────────────────────

  const flesh = sub.flesh || "#F8D98B";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    r * 0.76,
    -Math.PI / 2,
    Math.PI / 2
  );

  ctx.lineTo(0, -r * 0.76);
  ctx.closePath();

  ctx.fillStyle = flesh;
  ctx.fill();

  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1.5, r * 0.05);
  ctx.stroke();

  // ─────────────────────────────────────────────
  // WATERMELON / STRAWBERRY SEEDS
  // ─────────────────────────────────────────────

  if (sub.shape === "watermelon" || sub.shape === "strawberry" || sub.seeds) {
    ctx.fillStyle = ink;

    const seeds = [
      [0.28, -0.38],
      [0.48, -0.1],
      [0.3, 0.2],
      [0.52, 0.4],
      [0.18, 0.5],
      [0.65, 0.15],
    ];

    seeds.forEach(([x, y], index) => {
      ctx.save();

      ctx.translate(
        r * x,
        r * y
      );

      ctx.rotate(index * 0.35);

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        Math.max(1, r * 0.035),
        Math.max(1.8, r * 0.065),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    });
  }

  // ─────────────────────────────────────────────
  // ORANGE / CITRUS SEGMENTS
  // ─────────────────────────────────────────────

  if (sub.shape === "orange" || sub.segments) {
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = Math.max(1, r * 0.035);

    const segmentCount = 7;

    for (let i = 0; i < segmentCount; i++) {
      const angle =
        -Math.PI / 2 +
        (Math.PI * i) / (segmentCount - 1);

      ctx.beginPath();

      ctx.moveTo(0, 0);

      ctx.lineTo(
        Math.cos(angle) * r * 0.7,
        Math.sin(angle) * r * 0.7
      );

      ctx.stroke();
    }
  }

  // ─────────────────────────────────────────────
  // KIWI
  // ─────────────────────────────────────────────

  if (sub.shape === "kiwi") {
    // Pale center
    ctx.fillStyle = "#E8F5E9";

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      r * 0.25,
      -Math.PI / 2,
      Math.PI / 2
    );
    ctx.lineTo(0, -r * 0.25);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#C4D9C8";
    ctx.lineWidth = Math.max(1, r * 0.025);
    ctx.stroke();

    // Kiwi seeds
    ctx.fillStyle = ink;

    for (let i = 0; i < 12; i++) {
      const angle =
        -Math.PI / 2 +
        (Math.PI * i) / 11;

      const distance = r * 0.48;

      ctx.beginPath();

      ctx.ellipse(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        Math.max(0.8, r * 0.025),
        Math.max(1, r * 0.04),
        angle,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  // ─────────────────────────────────────────────
  // APPLE CORE
  // ─────────────────────────────────────────────

  if (sub.shape === "apple") {
    ctx.fillStyle = "#F6E0B5";

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      r * 0.22,
      -Math.PI / 2,
      Math.PI / 2
    );
    ctx.lineTo(0, -r * 0.22);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#D0A76B";
    ctx.lineWidth = Math.max(1, r * 0.025);
    ctx.stroke();

    // Apple seeds
    ctx.fillStyle = "#4A2F08";

    for (let i = 0; i < 2; i++) {
      ctx.save();

      ctx.translate(
        r * 0.15,
        (i === 0 ? -1 : 1) * r * 0.1
      );

      ctx.rotate(i === 0 ? -0.3 : 0.3);

      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        Math.max(1, r * 0.025),
        Math.max(1.5, r * 0.05),
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    }
  }

  // ─────────────────────────────────────────────
  // BANANA CROSS SECTION
  // ─────────────────────────────────────────────

  if (sub.shape === "banana") {
    ctx.fillStyle = "#FFF1B8";

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      r * 0.52,
      -Math.PI / 2,
      Math.PI / 2
    );
    ctx.lineTo(0, -r * 0.52);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#D9B94A";
    ctx.lineWidth = Math.max(1, r * 0.025);
    ctx.stroke();

    // Central banana dots
    ctx.fillStyle = "#8D734A";

    [
      [0.22, -0.12],
      [0.3, 0],
      [0.22, 0.12],
    ].forEach(([x, y]) => {
      ctx.beginPath();

      ctx.arc(
        r * x,
        r * y,
        Math.max(0.8, r * 0.025),
        0,
        Math.PI * 2
      );

      ctx.fill();
    });
  }

  // ─────────────────────────────────────────────
  // JUICY HIGHLIGHT
  // ─────────────────────────────────────────────

  ctx.fillStyle = white;

  ctx.beginPath();

  ctx.ellipse(
    r * 0.25,
    -r * 0.35,
    r * 0.08,
    r * 0.15,
    -0.4,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}

export function drawCartoonBomb(ctx: CanvasRenderingContext2D, r: number) {
  // Bomb Shadow
  ctx.fillStyle = "#1b1c1c";
  ctx.beginPath();
  ctx.arc(4, 4, r, 0, Math.PI * 2);
  ctx.fill();

  // Dark Heavy Bomb Core
  ctx.fillStyle = "#303030";
  ctx.strokeStyle = "#1b1c1c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sizzling Fuse
  ctx.strokeStyle = "#DDA15E";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(8, -r - 12, 14, -r - 10);
  ctx.stroke();

  // Spark Burst
  ctx.fillStyle = "#FFD84D";
  ctx.beginPath();
  ctx.arc(14, -r - 10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#E63946";
  ctx.beginPath();
  ctx.arc(14, -r - 10, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Hazard Cross Bones / Skull doodle
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("☠", 0, 6);
}


export function drawBladeTrail(
  ctx: CanvasRenderingContext2D,
  bladePoints: BladePoint[],
  bladeTheme: BladeTheme,
  isZen = false
) {
  if (bladePoints.length < 2) return;

  const points = bladePoints;
  const total = points.length;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw a smooth path through the blade points.
  const drawSmoothPath = () => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < total - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;

      ctx.quadraticCurveTo(
        current.x,
        current.y,
        midX,
        midY
      );
    }

    ctx.lineTo(
      points[total - 1].x,
      points[total - 1].y
    );
  };

  if (isZen) {
    // Ethereal Zen glowing pastel aura & smooth blade ribbon
    ctx.save();
    drawSmoothPath();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "#A7F3D0";
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 30;
    ctx.shadowColor = "#6EE7B7";
    ctx.shadowBlur = 28;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    drawSmoothPath();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = bladeTheme.primary;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 18;
    ctx.shadowColor = bladeTheme.primary;
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    drawSmoothPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 4;
    ctx.shadowColor = "#FFFFFF";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    // Leading glowing tip
    const tip = points[total - 1];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#A7F3D0";
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
    return;
  }

  // Recent points are brighter and wider.
  const progress = (i: number) => i / (total - 1);

  // 1. Soft atmospheric glow.
  ctx.save();
  drawSmoothPath();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = bladeTheme.primary;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 25;
  ctx.shadowColor = bladeTheme.primary;
  ctx.shadowBlur = 24;
  ctx.stroke();
  ctx.restore();

  // 2. Secondary colored energy aura.
  ctx.save();
  drawSmoothPath();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = bladeTheme.accent;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 12;
  ctx.shadowColor = bladeTheme.accent;
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  // 3. Tapered dark outer silhouette.
  for (let i = 1; i < total; i++) {
    const a = points[i - 1];
    const b = points[i];
    const t = progress(i);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "#15232D";
    ctx.globalAlpha = 0.25 + t * 0.65;
    ctx.lineWidth = 1.5 + t * 8;
    ctx.stroke();
  }

  // 4. Metallic silver blade body.
  drawSmoothPath();

  const metal = ctx.createLinearGradient(
    points[0].x,
    points[0].y,
    points[total - 1].x,
    points[total - 1].y
  );

  metal.addColorStop(0, "rgba(170, 225, 255, 0.05)");
  metal.addColorStop(0.25, "#A8DFFF");
  metal.addColorStop(0.48, "#FFFFFF");
  metal.addColorStop(0.7, "#D6F5FF");
  metal.addColorStop(1, "#FFFFFF");

  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = metal;
  ctx.lineWidth = 4.5;
  ctx.shadowColor = "#A8E8FF";
  ctx.shadowBlur = 8;
  ctx.stroke();

  // 5. Razor-sharp white cutting edge.
  ctx.save();
  drawSmoothPath();
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "#FFFFFF";
  ctx.shadowBlur = 5;
  ctx.stroke();
  ctx.restore();

  // 6. Bright leading edge.
  const tip = points[total - 1];

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = bladeTheme.primary;
  ctx.shadowBlur = 18;

  ctx.beginPath();
  ctx.arc(tip.x, tip.y, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}


export function drawJuiceParticles(
  ctx: CanvasRenderingContext2D,
  particles: JuiceParticle[]
) {
  if (!particles.length) return;

  ctx.save();

  // First pass: subtle soft ambient juice glow
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const lifeRatio = Math.max(0, Math.min(1, p.life));
    const currentRadius = p.size * lifeRatio;
    if (currentRadius <= 0.5) continue;

    ctx.globalAlpha = lifeRatio * 0.22;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, currentRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Second pass: Droplets with velocity elongation, ink outline, and glossy shine
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const lifeRatio = Math.max(0, Math.min(1, p.life));
    const radius = Math.max(1, p.size * lifeRatio);

    const speed = Math.hypot(p.vx, p.vy);
    const angle = Math.atan2(p.vy, p.vx);

    // Stretch droplet slightly along velocity for fluid juice motion
    const stretch = Math.min(2.4, 1 + speed * 0.12);
    const radX = radius * stretch;
    const radY = Math.max(0.8, radius / Math.sqrt(stretch));

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.globalAlpha = Math.min(1, lifeRatio * 1.2);

    // 1. Droplet body
    ctx.beginPath();
    ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // 2. Crisp cartoon outline (scaled with particle size)
    ctx.strokeStyle = "#1b1c1c";
    ctx.lineWidth = Math.max(1, radius * 0.28);
    ctx.stroke();

    // 3. Juicy specular gloss highlight (curved liquid gleam)
    if (radius >= 2.5) {
      ctx.beginPath();
      ctx.ellipse(-radX * 0.28, -radY * 0.32, radX * 0.45, Math.max(0.6, radY * 0.35), -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
      ctx.fill();

      // Tiny secondary pin-point gleam
      if (radius >= 4.5) {
        ctx.beginPath();
        ctx.arc(radX * 0.35, radY * 0.2, Math.max(0.5, radius * 0.18), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.fill();
      }
    }

    ctx.restore();
  }

  ctx.restore();
}

export function drawTextPopups(
  ctx: CanvasRenderingContext2D,
  popups: TextPopup[]
) {
  popups.forEach((tp) => {
    ctx.save();
    ctx.translate(tp.x, tp.y);
    ctx.font = `800 ${Math.round(20 * tp.scale)}px 'Bricolage Grotesque', 'Rubik', sans-serif`;
    ctx.textAlign = "center";

    // Dark ink stroke outline
    ctx.strokeStyle = "#1b1c1c";
    ctx.lineWidth = 5;
    ctx.strokeText(tp.text, 0, 0);

    // Core text color
    ctx.fillStyle = tp.color;
    ctx.fillText(tp.text, 0, 0);
    ctx.restore();
  });
}

export function drawExplosions(
  ctx: CanvasRenderingContext2D,
  explosions: ExplosionEffect[]
) {
  explosions.forEach((exp) => {
    const t = exp.progress; // 0 to 1 over 1.0s
    ctx.save();
    ctx.translate(exp.x, exp.y);

    // 1. Expanding Shockwave Ring with Ink Outline
    const shockwaveRadius = exp.maxRadius * (0.3 + 1.2 * t);
    const shockwaveAlpha = Math.max(0, 1 - t * 1.2);
    if (shockwaveAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = shockwaveAlpha;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.arc(0, 0, shockwaveRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#FFD84D";
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, shockwaveRadius - 3), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Comic Blast Star (peaks at t ≈ 0.2, fades out by t ≈ 0.6)
    if (t < 0.65) {
      const starScale = Math.sin((t / 0.65) * Math.PI);
      const outerR = exp.maxRadius * 1.1 * starScale;
      const innerR = exp.maxRadius * 0.45 * starScale;
      const points = 12;

      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Bold ink border
      ctx.fillStyle = "#FFD84D";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 4;
      ctx.fill();
      ctx.stroke();

      // Inner flame star
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = (i % 2 === 0 ? outerR : innerR) * 0.65;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "#FF3B30";
      ctx.fill();
      ctx.restore();
    }

    // 3. Expanding Smoke Puffs (expand outward and drift upward)
    exp.smoke.forEach((sm) => {
      const smokeProgress = Math.min(1, t * 1.1);
      const sx = sm.xOffset * (1 + smokeProgress * 1.5);
      const sy = sm.yOffset * (1 + smokeProgress * 1.2) - smokeProgress * 28;
      const currentSize = sm.size * (0.5 + 0.8 * smokeProgress);
      const alpha = Math.max(0, 1 - t);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sx, sy);
      ctx.rotate(sm.rotation + t * 0.5);

      ctx.fillStyle = sm.color;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // 4. Fiery Fireball Core (White-hot core -> Orange -> Red)
    if (t < 0.5) {
      const coreScale = Math.sin((t / 0.5) * Math.PI);
      const coreRadius = exp.maxRadius * 0.55 * coreScale;
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 5. Flying Ember Sparks (high velocity burst, with comic ink dots)
    exp.sparks.forEach((sp) => {
      const dist = sp.distance * t * (1.2 - t * 0.3);
      const sx = sp.vx * dist;
      const sy = sp.vy * dist + t * t * 35; // gravity arc
      const sparkAlpha = Math.max(0, 1 - t * 1.1);
      const sparkSize = Math.max(1.5, sp.size * (1 - t * 0.5));

      ctx.save();
      ctx.globalAlpha = sparkAlpha;
      ctx.fillStyle = sp.color;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, sparkSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  });
}

/**
 * Renders calm ambient floating sakura petals & light orbs for Zen Mode
 */
export function drawZenAmbientAtmosphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tick: number
) {
  ctx.save();
  const count = 16;
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const speed = 0.35 + (i % 3) * 0.18;
    const y = (height + 50) - ((tick * speed + seed * 8) % (height + 100));
    const sway = Math.sin(tick * 0.015 + i) * 30;
    const x = ((seed * 5.3 + sway) % (width - 40)) + 20;
    const size = 5 + (i % 4) * 2.5;
    const alpha = 0.22 + Math.sin(tick * 0.025 + i) * 0.1;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tick * 0.008 + i);
    ctx.fillStyle =
      i % 2 === 0
        ? `rgba(244, 143, 177, ${alpha})`
        : `rgba(167, 243, 208, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.52, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}


