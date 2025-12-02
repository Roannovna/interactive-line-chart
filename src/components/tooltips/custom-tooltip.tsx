import type { RechartsTooltipProps } from "../../types";
import calendarIcon from "../../assets/calendar.svg";
import bestIcon from "../../assets/best.svg";
import { tooltipFormatDate } from "../../utils/format-date";
import styles from "./custom-tooltip.module.css";

export const CustomTooltip = (props: RechartsTooltipProps) => {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;

  const isFiniteValue = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? NaN);
    return Number.isFinite(n);
  };

  const items = [...payload]
    .filter((it) => isFiniteValue(it.value))
    .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0));

  if (items.length === 0) return null;

  const winnerName = items[0]?.name;

  const formatPercent = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return `${n.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;
  };

  return (
    <div className={styles["tooltip-box"]}>
      <div className={styles["tooltip-header"]}>
        <img src={calendarIcon} alt="" width={18} height={18} />
        <span className={styles["tooltip-date"]}>
          {tooltipFormatDate(label as unknown as number)}
        </span>
      </div>
      <div className={styles["tooltip-divider"]} />
      <div className={styles["tooltip-list"]}>
        {items.map((it, idx) => {
          const color = (it.color as string) || "#000";
          return (
            <div
              key={String(it.dataKey ?? it.name ?? idx)}
              className={styles["tooltip-item"]}
            >
              <div className={styles["tooltip-item-left"]}>
                <span
                  className={styles["tooltip-dot"]}
                  style={{ backgroundColor: color }}
                />
                <span>{it.name}</span>
                {it.name === winnerName ? (
                  <img src={bestIcon} alt="" width={18} height={18} />
                ) : null}
              </div>
              <span className={styles["tooltip-value"]}>{formatPercent(it.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
