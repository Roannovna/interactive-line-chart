import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import classNames from "classnames";
import { CHART_COLORS } from "../../styles/chart-colors";
import { axisFormatDate } from "../../utils";
import { useState, useMemo, useEffect, useRef } from "react";
import { CustomTooltip } from "../tooltips/custom-tooltip";
import styles from "./conversions-chart.module.css";
import { ChartControls } from "./chart-controls";
import html2canvas from "html2canvas";

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
  const chartRef = useRef<HTMLDivElement>(null);

  const dataCurrent = timePeriod === "day" ? dataDay : dataWeek;

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--bg-color")
          .trim(),
      });
      const link = document.createElement("a");
      link.download = "chart-export.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const allKeys = useMemo(
    () => Object.keys(dataCurrent[0] || {}).filter((k) => k !== "date"),
    [dataCurrent]
  );

  const [selectedVariations, setSelectedVariations] =
    useState<string[]>(allKeys);
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
      <ChartControls
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        selectedVariations={selectedVariations}
        handleVariationsChange={(e) => {
          const val = e.target.value;
          setSelectedVariations(val === "all" ? allKeys : [val]);
        }}
        allKeys={allKeys}
        chartType={chartType}
        setChartType={setChartType}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        zoomOut={zoomOut}
        zoomIn={zoomIn}
        resetView={resetView}
        onExport={handleExport}
      />
      <div
        ref={chartRef}
        className={classNames(styles["conversions-chart__wrapper"], {
          [styles["conversions-chart__wrapper--fullscreen"]]: isFullscreen,
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ChartLineStyle
            data={dataCurrent.slice(brushStart, brushEnd + 1)}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--axis-lines-color)"
            />
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
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
              wrapperStyle={{ pointerEvents: "auto", outline: "none" }}
              trigger="click"
            />
            {selectedVariations.map((key) =>
              renderSeries(key, allKeys.indexOf(key))
            )}
          </ChartLineStyle>
        </ResponsiveContainer>
      </div>
    </>
  );
};
