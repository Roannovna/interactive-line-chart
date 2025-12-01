export const tooltipFormatDate = (tickItem: number) => {
  return new Date(tickItem).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};
