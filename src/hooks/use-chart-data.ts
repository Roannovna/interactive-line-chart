import { useMemo } from "react";
import { data } from "../data/сonversions";
import { processDailyData, processWeeklyData } from "../utils/data-transform";

export const useChartData = () => {
  const conversionData = useMemo(() => processDailyData(data), []);
  const weeklyConversionData = useMemo(() => processWeeklyData(data), []);

  return { conversionData, weeklyConversionData };
};
