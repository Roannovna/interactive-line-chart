import { ConversionChart } from "./components";
import { useChartData } from "./hooks/use-chart-data";

function App() {
  const { conversionData } = useChartData();

  return <ConversionChart data={conversionData} />;
}

export default App;
