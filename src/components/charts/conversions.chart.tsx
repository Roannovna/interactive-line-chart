import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  AreaChart,
} from "recharts";
import { CHART_COLORS } from "../../styles/chart-colors";
import { tooltipFormatDate } from "../../utils";
import { useState, useMemo, useEffect } from "react";
import { CustomTooltip } from "../tooltips/custom-tooltip";

interface ConversionChartProps {
  dataDay: Record<string, number | string | null>[];
  dataWeek: Record<string, number | string | null>[];
}

export const ConversionChart = ({
  dataDay,
  dataWeek,
}: ConversionChartProps) => {
  const [chartType, setChartType] = useState("line");
  const [timePeriod, setTimePeriod] = useState("day");
  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(e.target.value);
  };
  const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimePeriod(e.target.value);
  };
  const allKeys = useMemo(() => {
    const base = (timePeriod === "day" ? dataDay : dataWeek)[0] || {};
    return Object.keys(base).filter((k) => k !== "date");
  }, [timePeriod, dataDay, dataWeek]);
  const [selectedVariations, setSelectedVariations] =
    useState<string[]>(allKeys);
  useEffect(() => {
    setSelectedVariations(allKeys);
  }, [allKeys]);
  const handleVariationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "all") setSelectedVariations(allKeys);
    else setSelectedVariations([val]);
  };

  const dataCurrent = timePeriod === "day" ? dataDay : dataWeek;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brushStart, setBrushStart] = useState(0);
  const [brushEnd, setBrushEnd] = useState(dataCurrent.length - 1);
  useEffect(() => {
    setBrushStart(0);
    setBrushEnd((timePeriod === "day" ? dataDay : dataWeek).length - 1);
  }, [timePeriod, dataDay, dataWeek]);
  const zoomStep = Math.max(
    1,
    Math.floor((timePeriod === "day" ? dataDay : dataWeek).length * 0.1)
  );
  const zoomIn = () => {
    const len = (timePeriod === "day" ? dataDay : dataWeek).length;
    const nextStart = Math.min(brushStart + zoomStep, len - 2);
    const nextEnd = Math.max(brushEnd - zoomStep, nextStart + 1);
    setBrushStart(nextStart);
    setBrushEnd(nextEnd);
  };
  const zoomOut = () => {
    const len = (timePeriod === "day" ? dataDay : dataWeek).length;
    const nextStart = Math.max(brushStart - zoomStep, 0);
    const nextEnd = Math.min(brushEnd + zoomStep, len - 1);
    setBrushStart(nextStart);
    setBrushEnd(nextEnd);
  };
  const resetView = () => {
    const len = (timePeriod === "day" ? dataDay : dataWeek).length;
    setBrushStart(0);
    setBrushEnd(len - 1);
    setIsFullscreen(false);
  };

  const ChartLineStyle = chartType.startsWith("line") ? LineChart : AreaChart;
  const ChartComponent = chartType.startsWith("line") ? Line : Area;

  return (
    <>
      <select
        name="timePeriod"
        id=""
        onChange={handleTimePeriodChange}
        value={timePeriod}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
      </select>
      <select
        name="variations"
        id=""
        onChange={handleVariationsChange}
        value={
          selectedVariations.length === allKeys.length
            ? "all"
            : selectedVariations[0] || "all"
        }
      >
        <option value="all">All variations selected</option>
        {allKeys.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <select name="chartType" id="" onChange={handleChartTypeChange}>
        <option value="line">Line (smooth)</option>
        <option value="line-linear">Line (linear)</option>
        <option value="line-smooth-outline">Line (smooth + outline)</option>
        <option value="area">Area</option>
      </select>
      <div
        style={{
          display: "inline-flex",
          gap: 8,
          marginLeft: 8,
          position: isFullscreen ? "fixed" : "relative",
          top: isFullscreen ? 12 : undefined,
          right: isFullscreen ? 12 : undefined,
          zIndex: 2,
        }}
      >
        <button
          onClick={() => setIsFullscreen((v) => !v)}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          ⤢
        </button>
        <div
          style={{
            display: "inline-flex",
            border: "1px solid #ddd",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <button
            onClick={zoomOut}
            style={{ padding: "4px 10px" }}
            title="Zoom out"
          >
            −
          </button>
          <button
            onClick={zoomIn}
            style={{ padding: "4px 10px", borderLeft: "1px solid #ddd" }}
            title="Zoom in"
          >
            +
          </button>
        </div>
        <button onClick={resetView} title="Reset">
          ⟲
        </button>
      </div>
      <ChartLineStyle
        style={{
          width: "100%",
          position: isFullscreen ? "fixed" : "relative",
          left: isFullscreen ? 0 : undefined,
          top: isFullscreen ? 0 : undefined,
          zIndex: 1,
          maxWidth: isFullscreen ? "100vw" : "700px",
          maxHeight: isFullscreen ? "100vh" : "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={dataCurrent.slice(brushStart, brushEnd + 1)}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--axis-lines-color)" />
        <XAxis
          dataKey="date"
          tickFormatter={tooltipFormatDate}
          tick={{ fill: "var(--axis-label-color)" }}
          allowDataOverflow
        />
        <YAxis
          width="auto"
          name="conversion"
          tickFormatter={(v) => v + "%"}
          tick={{ fill: "var(--axis-label-color)" }}
          allowDataOverflow
        />
        <Tooltip content={<CustomTooltip />} />
        {selectedVariations.map((key) => {
          const i = allKeys.indexOf(key);
          if (!chartType.startsWith("line")) {
            return (
              <ChartComponent
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[i]}
                fill={CHART_COLORS[i]}
                dot={false}
              />
            );
          }
          if (chartType === "line-linear") {
            return (
              <ChartComponent
                key={key}
                type="linear"
                dataKey={key}
                stroke={CHART_COLORS[i]}
                fill={CHART_COLORS[i]}
                dot={false}
              />
            );
          }
          if (chartType === "line-smooth-outline") {
            return (
              <>
                <ChartComponent
                  key={`${key}-outline-main`}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[i]}
                  fill={CHART_COLORS[i]}
                  dot={false}
                  strokeWidth={10}
                  strokeOpacity={0.2}
                  strokeLinecap="square"
                  isAnimationActive={false}
                />
                <ChartComponent
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[i]}
                  fill={CHART_COLORS[i]}
                  dot={false}
                />
              </>
            );
          }
          return (
            <ChartComponent
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CHART_COLORS[i]}
              fill={CHART_COLORS[i]}
              dot={false}
            />
          );
        })}
      </ChartLineStyle>
    </>
  );
};
