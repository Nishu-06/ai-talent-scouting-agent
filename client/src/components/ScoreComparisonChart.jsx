const chartSeries = [
  { key: "matchScore", label: "Match", color: "#6ee7b7" },
  { key: "interestScore", label: "Interest", color: "#7dd3fc" },
  { key: "finalScore", label: "Final", color: "#f8fafc" },
];

function ScoreComparisonChart({ candidates }) {
  const topCandidates = candidates.slice(0, 6);

  if (!topCandidates.length) return null;

  const chartHeight = 220;
  const chartWidth = 760;
  const groupWidth = chartWidth / topCandidates.length;
  const innerBarGap = 12;
  const barWidth = 24;
  const maxBarHeight = 140;
  const baselineY = 170;

  return (
    <div className="section-shell animate-enter animate-enter-delay-2 overflow-hidden">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Visual Comparison</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Top candidates by score dimension</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Recruiters can quickly compare technical fit, candidate interest, and final priority without scanning every row first.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {chartSeries.map((series) => (
            <div key={series.key} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.color }} />
              {series.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="min-w-[720px]"
          role="img"
          aria-label="Candidate score comparison chart"
        >
          <line x1="28" y1={baselineY} x2={chartWidth - 16} y2={baselineY} stroke="rgba(255,255,255,0.16)" />
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = baselineY - (tick / 100) * maxBarHeight;
            return (
              <g key={tick}>
                <line x1="28" y1={y} x2={chartWidth - 16} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 6" />
                <text x="0" y={y + 4} fill="rgba(226,232,240,0.55)" fontSize="10">
                  {tick}
                </text>
              </g>
            );
          })}

          {topCandidates.map((candidate, candidateIndex) => {
            const groupX = 54 + candidateIndex * groupWidth;
            const label = candidate.name.split(" ")[0];

            return (
              <g key={candidate.id}>
                {chartSeries.map((series, seriesIndex) => {
                  const value = candidate[series.key] || 0;
                  const height = (value / 100) * maxBarHeight;
                  const x = groupX + seriesIndex * (barWidth + innerBarGap);
                  const y = baselineY - height;

                  return (
                    <g key={`${candidate.id}-${series.key}`}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        rx="10"
                        fill={series.color}
                        opacity={series.key === "finalScore" ? 0.95 : 0.82}
                      />
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fill="rgba(241,245,249,0.9)"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}

                <text
                  x={groupX + barWidth + innerBarGap}
                  y={baselineY + 24}
                  textAnchor="middle"
                  fill="rgba(226,232,240,0.75)"
                  fontSize="11"
                  fontWeight="500"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default ScoreComparisonChart;
