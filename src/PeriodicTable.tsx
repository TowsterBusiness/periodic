import { forwardRef, useImperativeHandle, useState } from "react";
import "./PeriodicTable.css";
import PeriodicElement from "./PeriodicElement";
import elementFile from "./assets/periodic_elements.json";
import { PeriodicElementProps } from "./PeriodicElement";

const PeriodicTable = forwardRef((ref) => {
  let grid = [];
  let elementNumber = 0;
  let [highlightHash] = useState(new Map());

  useImperativeHandle(ref, () => {
    return {
      triggerHighlight(atmNum: number, isHighlight: boolean) {
        highlightHash.set(atmNum, isHighlight);
      },
    };
  });

  for (let y = 0; y < 11; y++) {
    let row = [];
    for (let x = 0; x < 18; x++) {
      let element = elementFile.elements[elementNumber];

      if (!highlightHash.has(element.number)) {
        highlightHash.set(element.number, false);
      }

      let props: PeriodicElementProps = {
        element: element,
        isHighlight: highlightHash.get(element.number),
      };

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
      } else {
        props.element = null;
      }

      let elementHtml = (
        <PeriodicElement key={crypto.randomUUID()} {...props}></PeriodicElement>
      );

      row.push(elementHtml);
    }
    grid.push(
      <div key={y} className="grid-column">
        {row}
      </div>
    );
  }
  return <div id="grid-container">{grid}</div>;
});

export default PeriodicTable;
