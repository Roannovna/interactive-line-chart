export const formatDay = (tickItem: number) => {
  // Можно использовать нативный Date или библиотеку, например date-fns
  return new Date(tickItem).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};
