export const conversionRate = (visits: number = 0, conversions: number = 0) => {
  // if (!visits || !conversions) return 0;
  return (conversions / visits) * 100;
};
