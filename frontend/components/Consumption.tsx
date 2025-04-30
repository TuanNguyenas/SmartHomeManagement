import { LineChart } from "react-native-gifted-charts";

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];
const Consumption = () => {
  return <LineChart data={data} />;
};

export default Consumption;
