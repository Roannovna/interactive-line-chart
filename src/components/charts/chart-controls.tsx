import { chartControls } from "../../assets/chart-controls/export";
import classNames from "classnames";
import styles from "./conversions-chart.module.css";

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
  onExport?: () => void;
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
  onExport,
}: ChartControlsProps) => {
  return (
    <div className={styles["conversions-chart__display-controls"]}>
      <div className={styles["conversions-chart__display-controls-data"]}>
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
      <div className={styles["conversions-chart__display-controls-visual"]}>
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
          className={classNames(styles["conversions-chart__controls"], {
            [styles["conversions-chart__controls--fullscreen"]]: isFullscreen,
          })}
        >
          {onExport && (
            <button
              onClick={onExport}
              className={classNames(
                styles["conversions-chart__control-btn"],
                styles["conversions-chart__control-btn--export"]
              )}
              title="Export to PNG"
            >
              <img src={chartControls.pngIcon} alt="PNG" />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className={classNames(
              styles["conversions-chart__control-btn"],
              styles["conversions-chart__control-btn--fullscreen"]
            )}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <img
              src={chartControls.fullscreenIcon}
              alt="Fullscreen"
            />
          </button>
          <div className={styles["conversions-chart__zoom-group"]}>
            <button
              onClick={zoomOut}
              className={classNames(
                styles["conversions-chart__control-btn"],
                styles["conversions-chart__control-btn--zoom-out"]
              )}
              title="Zoom Out"
            >
              <img src={chartControls.zoomOutIcon} alt="Zoom Out" />
            </button>
            <button
              onClick={zoomIn}
              className={classNames(
                styles["conversions-chart__control-btn"],
                styles["conversions-chart__control-btn--zoom-in"]
              )}
              title="Zoom In"
            >
              <img src={chartControls.zoomInIcon} alt="Zoom In" />
            </button>
          </div>
          <button
            onClick={resetView}
            className={classNames(
              styles["conversions-chart__control-btn"],
              styles["conversions-chart__control-btn--reset"]
            )}
            title="Reset Zoom"
          >
            <img src={chartControls.resetIcon} alt="Reset" />
          </button>
        </div>
      </div>
    </div>
  );
};
