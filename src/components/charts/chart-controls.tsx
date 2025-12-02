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
    <div className={styles["chart-display-controls"]}>
      <div className={styles["chart-display-controls__data"]}>
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
      <div className={styles["chart-display-controls__visual"]}>
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
          className={classNames(styles["chart-controls"], {
            [styles["chart-controls--fullscreen"]]: isFullscreen,
          })}
        >
          {onExport && (
            <button
              onClick={onExport}
              className={classNames(
                styles["chart-controls__btn"],
                styles["chart-controls__btn--export"]
              )}
              title="Export to PNG"
              style={{ borderRadius: 4 }}
            >
              <img src={chartControls.pngIcon} alt="PNG" />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className={classNames(
              styles["chart-controls__btn"],
              styles["chart-controls__btn--fullscreen"]
            )}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <img src={chartControls.fullscreenIcon} alt="fullscreen" />
          </button>
          <div className={styles["chart-controls__zoom-group"]}>
            <button
              onClick={zoomOut}
              className={classNames(
                styles["chart-controls__btn"],
                styles["chart-controls__btn--zoom-out"]
              )}
              title="Zoom out"
            >
              <img src={chartControls.zoomOutIcon} alt="zoom out" />
            </button>
            <button
              onClick={zoomIn}
              className={classNames(
                styles["chart-controls__btn"],
                styles["chart-controls__btn--zoom-in"]
              )}
              title="Zoom in"
            >
              <img src={chartControls.zoomInIcon} alt="zoom in" />
            </button>
            <button
              onClick={resetView}
              className={classNames(
                styles["chart-controls__btn"],
                styles["chart-controls__btn--reset"]
              )}
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
