import React, { useState } from "react";

export interface PieSliceData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  subtext?: string;
}

interface PieChartProps {
  data: PieSliceData[];
  title?: string;
  centerValue?: string;
  centerLabel?: string;
  size?: number;
  thickness?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  centerValue,
  centerLabel,
  size = 180,
  thickness = 26,
  valuePrefix = "",
  valueSuffix = ""
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, slice) => acc + slice.value, 0);
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const center = radius;

  // Calculate SVG arc paths
  let cumulativeAngle = -90; // Start at 12 o'clock

  const slices = data.map((slice, index) => {
    const sliceAngle = (slice.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle += sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const ix1 = center + innerRadius * Math.cos(startRad);
    const iy1 = center + innerRadius * Math.sin(startRad);
    const ix2 = center + innerRadius * Math.cos(endRad);
    const iy2 = center + innerRadius * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    // SVG Path for Donut Slice
    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${ix2} ${iy2}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
      Z
    `;

    return {
      ...slice,
      pathData,
      index
    };
  });

  const activeSlice = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      {/* SVG Donut */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <path
                key={slice.name}
                d={slice.pathData}
                fill={slice.color}
                opacity={hoveredIndex === null || isHovered ? 1 : 0.45}
                stroke="#171717"
                strokeWidth={2}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  transform: isHovered ? "scale(1.03)" : "scale(1)",
                  transformOrigin: `${center}px ${center}px`
                }}
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-sm font-extrabold text-white tracking-tight">
            {activeSlice ? `${activeSlice.percentage}%` : centerValue || `${total.toLocaleString()}`}
          </span>
          <span className="text-[10px] font-medium text-neutral-400 truncate max-w-[80px]">
            {activeSlice ? activeSlice.name : centerLabel || "Total"}
          </span>
        </div>
      </div>

      {/* Legend & Stats List */}
      <div className="flex-1 space-y-2 w-full">
        {data.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                isHovered
                  ? "bg-[#182236] border-[#7FE87F]/50 shadow-sm"
                  : "bg-[#111726] border-[#2C2C44] hover:bg-[#182236]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {item.name}
                  </span>
                  {item.subtext && (
                    <span className="text-[10px] text-neutral-400 block">
                      {item.subtext}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-white block">
                  {valuePrefix}
                  {item.value.toLocaleString()}
                  {valueSuffix}
                </span>
                <span
                  className="text-[10.5px] font-bold block"
                  style={{ color: item.color }}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
