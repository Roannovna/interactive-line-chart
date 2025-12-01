import { ConversionChart } from "./components";
import { useChartData } from "./hooks/use-chart-data";

function App() {
  const { conversionData, weeklyConversionData } = useChartData();

  return <ConversionChart dataDay={conversionData} dataWeek={weeklyConversionData} />;
}

export default App;
