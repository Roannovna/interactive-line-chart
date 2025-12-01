import { useMemo } from "react";
import { data, variations } from "../data/сonversions";
import type { Variation, RawDataType } from "../types";
import { conversionRate } from "../utils";

const getConversionRateForAllVariations = (item: RawDataType) => {
  const month = item.date;

  const variantsConversions = variations.map((variation: Variation) => {
    const name = variation.name;
    const id = variation.id || "0";
    return {
      [name]: conversionRate(item.visits[id], item.conversions[id]),
    };
  });

  const transformedVariantsConversions = Object.assign(
    {},
    ...variantsConversions
  );

  return {
    date: month,
    ...transformedVariantsConversions,
  };
};

export const useChartData = () => {
  const conversionData = useMemo(() => {
    const res = data?.map((item) => getConversionRateForAllVariations(item));
    return res;
  }, []);

  const weeklyConversionData = useMemo(() => {
    const getWeekStart = (dateStr: string) => {
      const d = new Date(dateStr);
      const day = d.getDay();
      const diff = (day + 6) % 7;
      d.setDate(d.getDate() - diff);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    };

    const grouped: Record<
      string,
      { visits: Record<string, number>; conversions: Record<string, number> }
    > = {};

    data.forEach((item) => {
      const weekKey = getWeekStart(item.date);
      if (!grouped[weekKey]) {
        grouped[weekKey] = { visits: {}, conversions: {} };
      }
      Object.keys(item.visits).forEach((id) => {
        grouped[weekKey].visits[id] =
          (grouped[weekKey].visits[id] || 0) + item.visits[id];
      });
      Object.keys(item.conversions).forEach((id) => {
        grouped[weekKey].conversions[id] =
          (grouped[weekKey].conversions[id] || 0) + item.conversions[id];
      });
    });

    const res = Object.keys(grouped).map((weekKey) => {
      const variantsConversions = variations.map((variation: Variation) => {
        const name = variation.name;
        const id = String(variation.id || "0");
        const v = grouped[weekKey].visits[id] || 0;
        const c = grouped[weekKey].conversions[id] || 0;
        return { [name]: conversionRate(v, c) };
      });
      const transformed = Object.assign({}, ...variantsConversions);
      return { date: weekKey, ...transformed } as Record<
        string,
        number | string | null
      >;
    });

    return res;
  }, []);

  return { conversionData, weeklyConversionData };
};
