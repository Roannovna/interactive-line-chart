import { useMemo } from "react";
import {
  data,
  variations,
  type RawDataType,
  type Variation,
} from "../data/сonversions";
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
  }, [data]);

  return { conversionData };
};
