export type RechartsTooltipPayload = {
  name?: string;
  value?: number | string | null;
  color?: string;
  dataKey?: string;
};

export type RechartsTooltipProps = {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  label?: string | number;
};

export type Variation = {
  id?: number;
  name: string;
};

export type RawDataType = {
  date: string;
  visits: { [key: string]: number };
  conversions: { [key: string]: number };
};
