import "./PeriodicTable.css";
import PeriodicElement from "./PeriodicElement";
import elementFile from "./assets/periodic_elements.json";
import { ElementJson } from "./ElementDataTypes";
import { PeriodicElementProps } from "./PeriodicElement";

function App() {
  let grid = [];
  let elementNumber = 0;
  for (let y = 0; y < 11; y++) {
    let row = [];
    for (let x = 0; x < 18; x++) {
      let element = elementFile.elements[elementNumber];

      let props: PeriodicElementProps = {
        id: y * x,
        element: element,
        highlight: false,
      };

      if (element.xpos - 1 == x && element.ypos - 1 == y) {
        elementNumber++;
      } else {
        props.element = null;
      }

      row.push(PeriodicElement(props));
    }
    grid.push(<div className="grid-column">{row}</div>);
  }
  return <div id="grid-container">{grid}</div>;
}

export default App;
