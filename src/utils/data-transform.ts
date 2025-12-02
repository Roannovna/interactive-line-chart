import { variations } from "../data/сonversions";
import type { Variation, RawDataType } from "../types";
import { conversionRate, getWeekStart } from "./index";

export const processDailyData = (data: RawDataType[]) => {
  return data?.map((item) => {
    const variantsConversions = variations.map((variation: Variation) => {
      const name = variation.name;
      const id = variation.id || "0";
      return {
        [name]: conversionRate(item.visits[id], item.conversions[id]),
      };
    });

    return {
      date: item.date,
      ...Object.assign({}, ...variantsConversions),
    };
  });
};

export const processWeeklyData = (data: RawDataType[]) => {
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

  return Object.keys(grouped).map((weekKey) => {
    const variantsConversions = variations.map((variation: Variation) => {
      const name = variation.name;
      const id = String(variation.id || "0");
      const v = grouped[weekKey].visits[id] || 0;
      const c = grouped[weekKey].conversions[id] || 0;
      return { [name]: conversionRate(v, c) };
    });

    return {
      date: weekKey,
      ...Object.assign({}, ...variantsConversions),
    } as Record<string, number | string | null>;
  });
};
