import { chartControls } from "../../assets/chart-controls/export";
import "./conversions-chart.css";

interface ChartControlsProps {
  timePeriod: string;
  setTimePeriod: (v: string) => void;
  selectedVariations: string[];
  handleVariationsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  allKeys: string[];
  chartType: string;
  setChartType: (v: string) => void;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void;
  zoomOut: () => void;
  zoomIn: () => void;
  resetView: () => void;
}

export const ChartControls = ({
  timePeriod,
  setTimePeriod,
  selectedVariations,
  handleVariationsChange,
  allKeys,
  chartType,
  setChartType,
  isFullscreen,
  setIsFullscreen,
  zoomOut,
  zoomIn,
  resetView,
}: ChartControlsProps) => {
  return (
    <div className="chart-display-controls">
      <div className="chart-display-controls__data">
        <select
          name="timePeriod"
          onChange={(e) => setTimePeriod(e.target.value)}
          value={timePeriod}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
        </select>
        <select
          name="variations"
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
      </div>
      <div className="chart-display-controls__visual">
        <select
          name="chartType"
          onChange={(e) => setChartType(e.target.value)}
          value={chartType}
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
  );
};
