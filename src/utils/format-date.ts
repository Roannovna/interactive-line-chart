export const tooltipFormatDate = (tickItem: number) => {
  return new Date(tickItem).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const axisFormatDate = (tickItem: number) => {
  return new Date(tickItem).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export const getWeekStart = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
