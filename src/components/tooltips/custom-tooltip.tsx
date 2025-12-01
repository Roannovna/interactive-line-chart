type RechartsTooltipPayload = {
  name?: string;
  value?: number | string | null;
  color?: string;
  dataKey?: string;
};
type RechartsTooltipProps = {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  label?: string | number;
};
import calendarIcon from "../../assets/calendar.svg";
import bestIcon from "../../assets/best.svg";
import { tooltipFormatDate } from "../../utils/format-date";

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
    <div
      style={{
        background: "var(--bg-color)",
        color: "var(--main-text-color)",
        borderRadius: 12,
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        padding: 12,
        minWidth: 220,
        maxWidth: 280,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <img src={calendarIcon} alt="" width={18} height={18} />
        <span style={{ color: "var(--chart-data-color)" }}>
          {tooltipFormatDate(label as unknown as number)}
        </span>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--axis-lines-color)",
          margin: "8px 0 6px",
        }}
      />
      <div style={{ maxHeight: 108, overflowY: "auto", paddingRight: 6 }}>
        {items.map((it, idx) => {
          const color = (it.color as string) || "#000";
          return (
            <div
              key={String(it.dataKey ?? it.name ?? idx)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px dashed #E1DFE7",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <span>{it.name}</span>
                {it.name === winnerName ? (
                  <img src={bestIcon} alt="" width={18} height={18} />
                ) : null}
              </div>
              <span style={{ color: "var(--chart-data-color)" }}>
                {formatPercent(it.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
