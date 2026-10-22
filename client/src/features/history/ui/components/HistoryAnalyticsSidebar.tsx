import React, { memo } from "react";
import { TrendingUp, Trophy } from "lucide-react";
import type { GameRunRecord } from "../../api/history.api";

interface HistoryAnalyticsSidebarProps {
  summaryMetrics: {
    bestScore: number;
    avgScore: number;
    bestCombo: number;
    avgAccuracy: number;
  };
  telemetryData: GameRunRecord[];
  topFiveRuns: GameRunRecord[];
  onOpenDetails: (run: GameRunRecord) => void;
}

export const HistoryAnalyticsSidebar: React.FC<HistoryAnalyticsSidebarProps> = memo(
  ({ summaryMetrics, telemetryData, topFiveRuns, onOpenDetails }) => {
    // Generate clean SVG points from telemetry scores
    const maxTelemetryScore = Math.max(
      ...telemetryData.map((d) => d.score),
      summaryMetrics.bestScore,
      1000
    );

    const chartPoints = telemetryData.map((run, i) => {
      const x = telemetryData.length > 1 ? (i / (telemetryData.length - 1)) * 260 + 20 : 150;
      const y = 100 - (run.score / maxTelemetryScore) * 80;
      return { x, y, run };
    });

    const polylineString = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const polygonString =
      chartPoints.length > 0
        ? `20,110 ${polylineString} ${chartPoints[chartPoints.length - 1].x},110`
        : "";

    return (
      <aside className="space-y-6 select-none">
        {/* Panel 1: Performance Metrics */}
        <div className="bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[6px_6px_0_0_#1b1c1c]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1b1c1c]">
            <div>
              <span className="font-['Rubik',sans-serif] text-[10px] uppercase font-bold text-[#5b403f] block">
                PERFORMANCE METRICS
              </span>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-lg font-black uppercase text-[#1b1c1c]">
                GETTING SHARPER // PROGRESSION
              </h3>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>

          <div className="space-y-2.5 mt-4">
            <div className="flex items-center justify-between p-2.5 bg-[#f6f3f2] border-2 border-[#1b1c1c] rounded-xl">
              <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#1b1c1c]">
                Best Score
              </span>
              <div className="flex items-center gap-2">
                <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-lg text-[#b61929]">
                  {summaryMetrics.bestScore.toLocaleString()}
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black border border-[#1b1c1c] rounded">
                  PEAK
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#f6f3f2] border-2 border-[#1b1c1c] rounded-xl">
              <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#1b1c1c]">
                Avg Score
              </span>
              <div className="flex items-center gap-2">
                <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-lg text-[#1b1c1c]">
                  {summaryMetrics.avgScore.toLocaleString()}
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black border border-[#1b1c1c] rounded">
                  MEAN
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#f6f3f2] border-2 border-[#1b1c1c] rounded-xl">
              <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#1b1c1c]">
                Best Combo
              </span>
              <div className="flex items-center gap-2">
                <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-lg text-[#9a4600]">
                  ×{summaryMetrics.bestCombo}
                </span>
                <span className="px-1.5 py-0.5 bg-[#ffdbc9] text-[#763300] text-[10px] font-black border border-[#1b1c1c] rounded">
                  MAX
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#f6f3f2] border-2 border-[#1b1c1c] rounded-xl">
              <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#1b1c1c]">
                Avg Accuracy
              </span>
              <div className="flex items-center gap-2">
                <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-lg text-emerald-700">
                  {summaryMetrics.avgAccuracy}%
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black border border-[#1b1c1c] rounded">
                  CLEAN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Telemetry Chart */}
        <div className="bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[6px_6px_0_0_#1b1c1c]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1b1c1c]">
            <div>
              <span className="font-['Rubik',sans-serif] text-[10px] uppercase font-bold text-[#5b403f] block">
                TELEMETRY
              </span>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-lg font-black uppercase text-[#1b1c1c]">
                SCORE OVER TIME
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-[#ffe07e] border border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] font-black rounded">
              LAST {telemetryData.length} RUNS
            </span>
          </div>

          <div className="mt-4 bg-[#FFF4D6] border-2 border-[#1b1c1c] p-3 rounded-xl">
            <div className="flex justify-between font-['Rubik',sans-serif] text-[10px] font-black text-[#5b403f] mb-1">
              <span>PEAK: {(maxTelemetryScore / 1000).toFixed(1)}K</span>
              <span>MEDIAN TRAJECTORY</span>
            </div>

            <svg
              className="w-full h-36"
              fill="none"
              viewBox="0 0 300 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid lines */}
              <line opacity="0.3" stroke="#252525" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="300" y1="20" y2="20" />
              <line opacity="0.3" stroke="#252525" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="300" y1="60" y2="60" />
              <line opacity="0.3" stroke="#252525" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="300" y1="100" y2="100" />

              {/* Shaded area */}
              {polygonString && (
                <polygon fill="#FFD84D" opacity="0.45" points={polygonString} />
              )}

              {/* Main trajectory lines */}
              {polylineString && (
                <>
                  <polyline
                    points={polylineString}
                    stroke="#1b1c1c"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  />
                  <polyline
                    points={polylineString}
                    stroke="#D9363E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </>
              )}

              {/* Hard points */}
              {chartPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={i === chartPoints.length - 1 ? 5 : 3.5}
                  fill={i === chartPoints.length - 1 ? "#D9363E" : "#1b1c1c"}
                />
              ))}
            </svg>

            <div className="flex justify-between font-['Rubik',sans-serif] text-[9px] font-black text-[#5b403f] mt-1 uppercase">
              <span>EARLIEST RUN</span>
              <span>LATEST RUN</span>
            </div>
          </div>
        </div>

        {/* Panel 3: Hall of Fame (Top 5 Runs) */}
        <div className="bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[6px_6px_0_0_#1b1c1c]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1b1c1c]">
            <div>
              <span className="font-['Rubik',sans-serif] text-[10px] uppercase font-bold text-[#5b403f] block">
                HALL OF FAME
              </span>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-lg font-black uppercase text-[#1b1c1c]">
                YOUR TOP 5 RUNS
              </h3>
            </div>
            <Trophy className="w-6 h-6 text-[#b61929]" />
          </div>

          <div className="space-y-2 mt-4 font-['Rubik',sans-serif] text-xs">
            {topFiveRuns.map((run, i) => (
              <div
                key={run.sessionId || i}
                onClick={() => onOpenDetails(run)}
                className={`flex items-center justify-between p-2 rounded-xl border-2 border-[#1b1c1c] cursor-pointer transition-transform hover:-translate-y-0.5 ${
                  i === 0
                    ? "bg-[#ffe07e] shadow-[2px_2px_0_0_#1b1c1c]"
                    : "bg-[#f6f3f2]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1b1c1c]">#{i + 1}</span>
                  <span className="font-bold text-[#1b1c1c] uppercase">
                    Run #{run.sessionId ? run.sessionId.slice(-4) : `0${i + 1}`} ({run.mode})
                  </span>
                </div>
                <span className="font-['Bricolage_Grotesque',sans-serif] font-black text-[#b61929] text-sm">
                  {run.score.toLocaleString()} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }
);

HistoryAnalyticsSidebar.displayName = "HistoryAnalyticsSidebar";
