import "./PeriodicTable.css";
import PeriodicElement from "./PeriodicElement";
import elementFile from "./assets/periodic_elements.json";
import { ElementJson } from "./ElementDataTypes";
import { PeriodicElementProps } from "./PeriodicElement";

function App() {
  let grid = [];
  let elementNumber = 0;
  let elementHash = new Map();
  for (let y = 0; y < 11; y++) {
    let row = [];
    for (let x = 0; x < 18; x++) {
      let element = elementFile.elements[elementNumber];

      let props: PeriodicElementProps = {
        element: element,
        highlight: false,
      };

      let isSave = false;
      if (element.xpos - 1 == x && element.ypos - 1 == y) {
        if (elementNumber == 55) {
          elementNumber = 71;
        } else if (elementNumber == 87) {
          elementNumber = 103;
        } else if (elementNumber == 117) {
          elementNumber = 56;
        } else if (elementNumber == 70) {
          elementNumber = 88;
        } else {
          elementNumber++;
        }
        isSave = true;
      } else {
        props.element = null;
      }

      let elementHtml = (
        <PeriodicElement key={crypto.randomUUID()} {...props}></PeriodicElement>
      );

      if (isSave) {
        elementHash.set(props.element?.symbol, elementHtml);
      }

      row.push(elementHtml);
    }
    grid.push(
      <div key={y} className="grid-column">
        {row}
      </div>
    );
  }
  return <div id="grid-container">{grid}</div>;
}

export default App;
