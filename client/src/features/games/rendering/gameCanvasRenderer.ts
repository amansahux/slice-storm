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

export function drawCartoonFruit(
  ctx: CanvasRenderingContext2D,
  sub: FruitTypeConfig,
  r: number
) {
  // 3D Offset Ink Shadow
  ctx.fillStyle = "#1b1c1c";
  ctx.beginPath();
  ctx.arc(4, 4, r, 0, Math.PI * 2);
  ctx.fill();

  // Outer Rind / Skin
  ctx.fillStyle = sub.skin;
  ctx.strokeStyle = "#1b1c1c";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner Pulp / Flesh
  ctx.fillStyle = sub.flesh;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Fruit Centerpiece / Seeds
  if (sub.seeds) {
    ctx.fillStyle = "#1b1c1c";
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * (r * 0.4),
        Math.sin(angle) * (r * 0.4),
        2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  // Cartoon Specular Shine
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

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

  // Fruit Outer Half
  ctx.fillStyle = sub.skin;
  ctx.strokeStyle = "#1b1c1c";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fruit Pulp Cross Section
  ctx.fillStyle = sub.flesh;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.75, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

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

