import { ElementJson } from "./ElementDataTypes";

export interface PeriodicElementProps {
  element: ElementJson;
  highlight: boolean;
}

function App(props: PeriodicElementProps) {
  return <span className="element-periodic">{props.element.symbol}</span>;
}

export default App;
