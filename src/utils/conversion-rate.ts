export const conversionRate = (visits: number = 0, conversions: number = 0) => {
  return (conversions / visits) * 100;
};
