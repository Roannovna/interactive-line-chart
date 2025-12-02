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
import { axisFormatDate } from "../../utils";
import { useState, useMemo, useEffect } from "react";
import { CustomTooltip } from "../tooltips/custom-tooltip";
import "./conversions-chart.css";
import { chartControls } from "../../assets/chart-controls/export";

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dataCurrent = timePeriod === "day" ? dataDay : dataWeek;

  const allKeys = useMemo(
    () => Object.keys(dataCurrent[0] || {}).filter((k) => k !== "date"),
    [dataCurrent]
  );

  const [selectedVariations, setSelectedVariations] = useState<string[]>(allKeys);
  const [brushStart, setBrushStart] = useState(0);
  const [brushEnd, setBrushEnd] = useState(dataCurrent.length - 1);

  useEffect(() => {
    setSelectedVariations(allKeys);
  }, [allKeys]);

  useEffect(() => {
    setBrushStart(0);
    setBrushEnd(dataCurrent.length - 1);
  }, [dataCurrent]);

  const zoomStep = Math.max(1, Math.floor(dataCurrent.length * 0.1));

  const zoomIn = () => {
    const len = dataCurrent.length;
    const nextStart = Math.min(brushStart + zoomStep, len - 2);
    const nextEnd = Math.max(brushEnd - zoomStep, nextStart + 1);
    setBrushStart(nextStart);
    setBrushEnd(nextEnd);
  };

  const zoomOut = () => {
    const len = dataCurrent.length;
    const nextStart = Math.max(brushStart - zoomStep, 0);
    const nextEnd = Math.min(brushEnd + zoomStep, len - 1);
    setBrushStart(nextStart);
    setBrushEnd(nextEnd);
  };

  const resetView = () => {
    setBrushStart(0);
    setBrushEnd(dataCurrent.length - 1);
    setIsFullscreen(false);
  };

  const ChartLineStyle = chartType.startsWith("line") ? LineChart : AreaChart;
  const ChartComponent = chartType.startsWith("line") ? Line : Area;

  const renderSeries = (key: string, index: number) => {
    const color = CHART_COLORS[index];
    const commonProps = {
      key,
      dataKey: key,
      stroke: color,
      fill: color,
      dot: false,
    };

    if (chartType === "line-smooth-outline") {
      return (
        <>
          <ChartComponent
            {...commonProps}
            key={`${key}-outline-main`}
            type="monotone"
            strokeWidth={10}
            strokeOpacity={0.2}
            strokeLinecap="square"
            isAnimationActive={false}
          />
          <ChartComponent {...commonProps} type="monotone" />
        </>
      );
    }

    return (
      <ChartComponent
        {...commonProps}
        type={chartType === "line-linear" ? "linear" : "monotone"}
      />
    );
  };


  return (
    <>
      <div className="chart-display-controls">
        <div className="chart-display-controls__data">
          <select
            name="timePeriod"
            id=""
            onChange={(e) => setTimePeriod(e.target.value)}
            value={timePeriod}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
          </select>
          <select
            name="variations"
            id=""
            onChange={(e) => {
              const val = e.target.value;
              setSelectedVariations(val === "all" ? allKeys : [val]);
            }}
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
        </div>
        <div className="chart-display-controls__visual">
          <select
            name="chartType"
            id=""
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line style: smooth line</option>
            <option value="line-linear">Line style: string line</option>
            <option value="line-smooth-outline">Line style: outline</option>
            <option value="area">Line style: area</option>
          </select>
          <div
            className={
              isFullscreen
                ? "chart-controls chart-controls--fullscreen"
                : "chart-controls"
            }
          >
            <button
              onClick={() => setIsFullscreen((v) => !v)}
              className="chart-controls__btn chart-controls__btn--fullscreen"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <img src={chartControls.fullscreenIcon} alt="fullscreen" />
            </button>
            <div className="chart-controls__zoom-group">
              <button
                onClick={zoomOut}
                className="chart-controls__btn chart-controls__btn--zoom-out"
                title="Zoom out"
              >
                <img src={chartControls.zoomOutIcon} alt="zoom out" />
              </button>
              <button
                onClick={zoomIn}
                className="chart-controls__btn chart-controls__btn--zoom-in"
                title="Zoom in"
              >
                <img src={chartControls.zoomInIcon} alt="zoom in" />
              </button>
              <button
                onClick={resetView}
                className="chart-controls__btn chart-controls__btn--reset"
                title="Reset"
              >
                <img src={chartControls.resetIcon} alt="reset" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ChartLineStyle
        className={
          isFullscreen
            ? "chart-wrapper chart-wrapper--fullscreen"
            : "chart-wrapper"
        }
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
          tickFormatter={axisFormatDate}
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
        <Tooltip
          active
          content={<CustomTooltip />}
          cursor={{ fill: "transparent" }}
          wrapperStyle={{ outline: "none" }}
        />
        {selectedVariations.map((key) =>
          renderSeries(key, allKeys.indexOf(key))
        )}
      </ChartLineStyle>
    </>
  );
};
