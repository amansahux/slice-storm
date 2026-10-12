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

  switch (sub.shape) {
    case "banana": {
      // Curved crescent yellow banana with green stem and brown tip
      // 3D Shadow
      ctx.save();
      ctx.translate(3, 4);
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.9, -0.9, 2.3);
      ctx.quadraticCurveTo(0, r * 0.35, -r * 0.9, -0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Banana yellow body
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.9, -0.9, 2.3);
      ctx.quadraticCurveTo(0, r * 0.35, -r * 0.9, -0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Curved ridge spine
      ctx.strokeStyle = "#E5B800";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, -0.8, 2.2);
      ctx.stroke();

      // Green top stalk
      ctx.fillStyle = "#70A020";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.rect(-r * 0.95, -r * 0.7, 7, 10);
      ctx.fill();
      ctx.stroke();

      // Dark brown bottom tip
      ctx.fillStyle = "#4A2F08";
      ctx.beginPath();
      ctx.arc(r * 0.58, r * 0.68, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "watermelon": {
      // Large round-oval with dark green wavy tiger stripes
      // 3D Offset Shadow
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.ellipse(4, 4, r * 1.05, r * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Green Rind
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.05, r * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dark green cartoon tiger stripes
      ctx.fillStyle = "#165B33";
      for (let i = -2; i <= 2; i++) {
        const xOffset = i * (r * 0.38);
        ctx.beginPath();
        ctx.moveTo(xOffset - 4, -r * 0.85);
        ctx.quadraticCurveTo(xOffset + 8, 0, xOffset - 4, r * 0.85);
        ctx.lineTo(xOffset + 4, r * 0.85);
        ctx.quadraticCurveTo(xOffset + 14, 0, xOffset + 4, -r * 0.85);
        ctx.closePath();
        ctx.fill();
      }

      // Specular shine
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.35, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "pineapple": {
      // Oval body with diamond cross-hatch texture + Spiky green crown on top
      // 3D Shadow
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.ellipse(3, 8, r * 0.78, r * 0.95, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spiky Crown Leaves (drawn behind pineapple body)
      ctx.fillStyle = "#2D8A4E";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3;
      const leafPoints = [-18, -9, 0, 9, 18];
      leafPoints.forEach((lx, idx) => {
        ctx.beginPath();
        ctx.moveTo(lx * 0.6, -r * 0.6);
        ctx.lineTo(lx * 1.1, -r * 1.4 - (idx % 2 === 0 ? 8 : 0));
        ctx.lineTo(lx * 0.6 + 6, -r * 0.6);
        ctx.fill();
        ctx.stroke();
      });

      // Golden Pineapple Body
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 6, r * 0.78, r * 0.95, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Diamond scale cross-hatching
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 6, r * 0.75, r * 0.92, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = "#B26B1E";
      ctx.lineWidth = 2.2;
      for (let d = -60; d <= 60; d += 16) {
        ctx.beginPath();
        ctx.moveTo(-r, d);
        ctx.lineTo(r, d + 40);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(r, d);
        ctx.lineTo(-r, d + 40);
        ctx.stroke();
      }

      // Center dots on pineapple diamonds
      ctx.fillStyle = "#7D430C";
      for (let dy = -20; dy <= 30; dy += 16) {
        for (let dx = -20; dx <= 20; dx += 16) {
          ctx.beginPath();
          ctx.arc(dx, dy + 6, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      break;
    }

    case "strawberry": {
      // Teardrop / Heart shaped with yellow seeds and three-leaf green hat
      // 3D Shadow
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.moveTo(3, 4 - r * 0.6);
      ctx.bezierCurveTo(3 + r, 4 - r * 0.5, 3 + r * 0.8, 4 + r * 0.6, 3, 4 + r * 1.05);
      ctx.bezierCurveTo(3 - r * 0.8, 4 + r * 0.6, 3 - r, 4 - r * 0.5, 3, 4 - r * 0.6);
      ctx.fill();

      // Red Body
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.bezierCurveTo(r, -r * 0.5, r * 0.8, r * 0.6, 0, r * 1.05);
      ctx.bezierCurveTo(-r * 0.8, r * 0.6, -r, -r * 0.5, 0, -r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tiny yellow seeds
      ctx.fillStyle = "#FFD84D";
      for (let row = -1; row <= 2; row++) {
        const rowY = row * (r * 0.28);
        const count = 4 - Math.abs(row);
        for (let c = 0; c < count; c++) {
          const seedX = (c - (count - 1) / 2) * (r * 0.38);
          ctx.beginPath();
          ctx.ellipse(seedX, rowY, 1.8, 2.6, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Green Leaf Cap
      ctx.fillStyle = "#34C759";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.lineTo(r * 0.5, -r * 0.85);
      ctx.lineTo(r * 0.2, -r * 0.6);
      ctx.lineTo(0, -r * 1.0);
      ctx.lineTo(-r * 0.2, -r * 0.6);
      ctx.lineTo(-r * 0.5, -r * 0.85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    case "apple": {
      // Indented top apple with brown stem and bright green leaf
      // 3D Shadow
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.arc(-r * 0.35 + 3, 4, r * 0.68, 0, Math.PI * 2);
      ctx.arc(r * 0.35 + 3, 4, r * 0.68, 0, Math.PI * 2);
      ctx.fill();

      // Apple Red Lobes
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.3);
      ctx.bezierCurveTo(r * 0.8, -r * 0.85, r * 1.15, r * 0.4, 0, r * 0.95);
      ctx.bezierCurveTo(-r * 1.15, r * 0.4, -r * 0.8, -r * 0.85, 0, -r * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Brown Stem
      ctx.strokeStyle = "#6B4423";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.3);
      ctx.quadraticCurveTo(4, -r * 0.75, 8, -r * 0.85);
      ctx.stroke();

      // Green Leaf
      ctx.fillStyle = "#34C759";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(8, -r * 0.6, 7, 4, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Specular Shine
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(-r * 0.4, -r * 0.25, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "kiwi": {
      // Fuzzy brown exterior with textured specks
      // 3D Shadow
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.ellipse(3, 4, r * 0.92, r * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brown fuzzy skin
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.92, r * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Fuzzy skin hair dots
      ctx.fillStyle = "#5E381A";
      for (let i = 0; i < 18; i++) {
        const angle = (i * Math.PI * 2) / 18;
        const dist = r * (0.45 + (i % 3) * 0.15);
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case "orange":
    default: {
      // Round citrus with textured dimples and little green stem node
      // 3D Shadow
      ctx.fillStyle = "#1b1c1c";
      ctx.beginPath();
      ctx.arc(4, 4, r, 0, Math.PI * 2);
      ctx.fill();

      // Orange Skin
      ctx.fillStyle = sub.skin;
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Citrus peel pores
      ctx.fillStyle = "#D46B08";
      for (let i = 0; i < 12; i++) {
        const angle = (i * 137.5 * Math.PI) / 180;
        const dist = (i / 12) * (r * 0.7);
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Little green leaf at top
      ctx.fillStyle = "#34C759";
      ctx.strokeStyle = "#1b1c1c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(4, -r + 2, 6, 3, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Shine
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.35, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
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
  ctx.scale(side, 1);

  // Dark Ink Extrusion Shadow
  ctx.fillStyle = "#1b1c1c";
  ctx.beginPath();
  ctx.arc(3, 3, r, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  // Outer Rind
  ctx.fillStyle = sub.skin;
  ctx.strokeStyle = "#1b1c1c";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner Juicy Flesh Cross-Section
  ctx.fillStyle = sub.flesh;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.76, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fruit Specific Cross-Section Insides:
  if (sub.shape === "watermelon" || sub.seeds) {
    // Black seeds floating in red watermelon/strawberry flesh
    ctx.fillStyle = "#1b1c1c";
    const seedAngles = [-0.9, -0.4, 0, 0.4, 0.9];
    seedAngles.forEach((a) => {
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (r * 0.48), Math.sin(a) * (r * 0.48), 2.8, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (sub.shape === "orange" || sub.segments) {
    // Citrus wedges / segment rays
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      const a = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.lineTo(Math.cos(a) * (r * 0.68), Math.sin(a) * (r * 0.68));
      ctx.stroke();
    }
  } else if (sub.shape === "kiwi") {
    // Light cream center with black poppy seeds ring
    ctx.fillStyle = "#E8F5E9";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1b1c1c";
    for (let a = -1.2; a <= 1.2; a += 0.35) {
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (r * 0.44), Math.sin(a) * (r * 0.44), 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (sub.shape === "apple") {
    // Apple star core & brown seeds
    ctx.fillStyle = "#4A2F08";
    ctx.beginPath();
    ctx.ellipse(r * 0.28, 0, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (sub.shape === "banana") {
    // Pale cream banana interior with 3 central star dots
    ctx.fillStyle = "#8D734A";
    ctx.beginPath();
    ctx.arc(r * 0.25, 0, 1.5, 0, Math.PI * 2);
    ctx.arc(r * 0.15, -3, 1.2, 0, Math.PI * 2);
    ctx.arc(r * 0.15, 3, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

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
  bladeTheme: BladeTheme
) {
  if (bladePoints.length < 2) return;

  ctx.save();
  for (let i = 1; i < bladePoints.length; i++) {
    const pt1 = bladePoints[i - 1];
    const pt2 = bladePoints[i];
    const widthRatio = i / bladePoints.length;

    // Hard black edge shadow
    ctx.beginPath();
    ctx.moveTo(pt1.x + 2, pt1.y + 2);
    ctx.lineTo(pt2.x + 2, pt2.y + 2);
    ctx.strokeStyle = "#1b1c1c";
    ctx.lineWidth = widthRatio * 12 + 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Vibrant blade core
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.strokeStyle = i % 2 === 0 ? bladeTheme.primary : bladeTheme.accent;
    ctx.lineWidth = widthRatio * 10;
    ctx.lineCap = "round";
    ctx.stroke();

    // White cutting shine center
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = widthRatio * 4;
    ctx.lineCap = "round";
    ctx.stroke();
  }
  ctx.restore();
}

export function drawJuiceParticles(
  ctx: CanvasRenderingContext2D,
  particles: JuiceParticle[]
) {
  particles.forEach((p) => {
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.strokeStyle = "#1b1c1c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(1, p.size * p.life), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
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

