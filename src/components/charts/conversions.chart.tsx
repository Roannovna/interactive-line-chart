import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CHART_COLORS } from "../../styles/chart-colors";
import { formatDay } from "../../utils";

interface ConversionChartProps {
  data: Record<string, number | string | null>[];
}

export const ConversionChart = ({ data }: ConversionChartProps) => {
  return (
    <LineChart
      style={{
        width: "100%",
        // TODO: какие максимальные параметры?
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={formatDay} />
      <YAxis width="auto" name="conversion" tickFormatter={(v) => v + "%"} />
      {/* TODO:Если нет данных, то и не должно быть записи tooltip вообще*/}
      <Tooltip formatter={(v) => Math.round((+v || 0) * 100) / 100 + "%"} />
      {Object.keys(data[0]).map((key, i) => {
        if (key === "date") return null;
        return (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i]}
            dot={false}
          />
        );
      })}
    </LineChart>
  );
};
