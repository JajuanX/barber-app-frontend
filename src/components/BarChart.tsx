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
};

const BarChart: React.FC<Props> = ({
  data,
  height = 180,
  max,
  color = '#1e88e5',
  showValues = false,
  valueFormatter,
  labelAngle = 0,
}) => {
  const maxVal = useMemo(() => (max !== undefined ? max : Math.max(1, ...data.map((d) => d.value))), [data, max]);
  const barWidth = Math.max(16, Math.floor(640 / Math.max(1, data.length)));
  const chartWidth = barWidth * data.length;
  const bottomMargin = labelAngle !== 0 ? 40 : 20;

  return (
    <div className="barchart">
      <svg width={chartWidth} height={height} className="barchart__svg">
        {data.map((d, i) => {
          const h = (d.value / maxVal) * (height - bottomMargin);
          const x = i * barWidth + 4;
          const y = height - h - bottomMargin;
          return (
            <g key={`${d.label}-${i}`}>
              <rect x={x} y={y} width={barWidth - 8} height={h} fill={color} rx={4} />
              {showValues && (
                <text x={x + (barWidth - 8) / 2} y={y - 4} textAnchor="middle" className="barchart__value">{valueFormatter ? valueFormatter(d.value) : d.value}</text>
              )}
              <text
                x={x + (barWidth - 8) / 2}
                y={height - 6}
                textAnchor="middle"
                className="barchart__label"
                transform={labelAngle ? `rotate(${labelAngle} ${x + (barWidth - 8) / 2} ${height - 6})` : undefined}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
