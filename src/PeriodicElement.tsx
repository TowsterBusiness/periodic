import elementFile from "./assets/periodic_elements.json";
import { ElementJson } from "./ElementDataTypes";
import "./PeriodicElement.css";

export interface PeriodicElementProps {
  element: ElementJson | null;
  highlight: boolean;
}

function App(props: PeriodicElementProps) {
  if (props.element == null) {
    return <span className="space-periodic"></span>;
  } else {
    return <span className="element-periodic">{props.element.symbol}</span>;
  }
}

export default App;
