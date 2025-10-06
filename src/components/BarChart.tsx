import React, { useMemo } from 'react';
import './BarChart.scss';

type Datum = { label: string; value: number };

type Props = {
  data: Datum[];
  height?: number;
  max?: number; // optional fixed max
  color?: string;
  showValues?: boolean;
  valueFormatter?: (n: number) => string;
  labelAngle?: number; // degrees to rotate labels, e.g., -35 to avoid overlap
  labelWrapChars?: number; // wrap labels into tspans at approx N chars per line
  labelFontSize?: number; // px font size for labels
  minBarWidth?: number; // minimum width per bar (improves readability)
};

function wrapLabel(label: string, maxChars: number): string[] {
  if (!maxChars || maxChars <= 0) return [label];
  const words = label.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      // If a single word is longer than max, hard-split it
      if (w.length > maxChars) {
        for (let i = 0; i < w.length; i += maxChars) {
          const part = w.slice(i, i + maxChars);
          if (part.length === maxChars) lines.push(part);
          else line = part; // keep last shorter chunk for next concat
        }
      } else {
        line = w;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

const BarChart: React.FC<Props> = ({
  data,
  height = 180,
  max,
  color = '#1e88e5',
  showValues = false,
  valueFormatter,
  labelAngle = 0,
  labelWrapChars = 0,
  labelFontSize = 12,
  minBarWidth = 16,
}) => {
  const maxVal = useMemo(() => (max !== undefined ? max : Math.max(1, ...data.map((d) => d.value))), [data, max]);
  const wrapped = useMemo(() => data.map((d) => wrapLabel(d.label, labelWrapChars)), [data, labelWrapChars]);
  const maxLines = useMemo(() => (wrapped.length ? Math.max(...wrapped.map((w) => w.length)) : 1), [wrapped]);
  // Estimate per-bar width based on label width so bars align with labels
  const charWidth = labelFontSize * 0.6; // rough average glyph width
  const perBarWidths = useMemo(() => {
    return data.map((d, i) => {
      const lineLengths = wrapped[i]?.length ? wrapped[i].map((s) => s.length) : [d.label.length];
      const maxChars = Math.max(...lineLengths);
      const est = Math.ceil(maxChars * charWidth) + 16; // padding for breathing room
      return Math.max(minBarWidth, est);
    });
  }, [data, wrapped, charWidth, minBarWidth]);
  const xOffsets = useMemo(() => {
    const xs: number[] = [];
    let acc = 0;
    for (let i = 0; i < perBarWidths.length; i += 1) {
      xs.push(acc);
      acc += perBarWidths[i];
    }
    return xs;
  }, [perBarWidths]);
  const chartWidth = useMemo(() => perBarWidths.reduce((a, b) => a + b, 0), [perBarWidths]);
  const bottomMargin = labelAngle !== 0 ? 40 : Math.max(24, maxLines * (labelFontSize + 2) + 12);

  return (
    <div className="barchart">
      <svg width={chartWidth} height={height} className="barchart__svg">
        {data.map((d, i) => {
          const barWidth = perBarWidths[i];
          const h = (d.value / maxVal) * (height - bottomMargin);
          const x = xOffsets[i] + 4;
          const y = height - h - bottomMargin;
          return (
            <g key={`${d.label}-${i}`}>
              <title>{`${d.label}: ${valueFormatter ? valueFormatter(d.value) : d.value}`}</title>
              <rect x={x} y={y} width={barWidth - 8} height={h} fill={color} rx={4} />
              {showValues && (
                <text x={x + (barWidth - 8) / 2} y={y - 4} textAnchor="middle" className="barchart__value">{valueFormatter ? valueFormatter(d.value) : d.value}</text>
              )}
              {labelWrapChars > 0 && labelAngle === 0 ? (
                <text
                  x={x + (barWidth - 8) / 2}
                  y={height - (bottomMargin - (labelFontSize + 2) * (maxLines - wrapped[i].length)) - 6}
                  textAnchor="middle"
                  className="barchart__label"
                  fontSize={labelFontSize}
                >
                  {wrapped[i].map((line, idx) => (
                    <tspan key={idx} x={x + (barWidth - 8) / 2} dy={idx === 0 ? 0 : labelFontSize + 2}>
                      {line}
                    </tspan>
                  ))}
                </text>
              ) : (
                <text
                  x={x + (barWidth - 8) / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className="barchart__label"
                  fontSize={labelFontSize}
                  transform={labelAngle ? `rotate(${labelAngle} ${x + (barWidth - 8) / 2} ${height - 6})` : undefined}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
