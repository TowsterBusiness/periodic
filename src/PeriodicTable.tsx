import { forwardRef, useImperativeHandle, useState } from "react";
import "./PeriodicTable.css";
import PeriodicElement from "./PeriodicElement";
import elementFile from "./assets/periodic_elements.json";
import { PeriodicElementProps } from "./PeriodicElement";

export interface PeriodicTableProps {
  elementList: Array<number>;
}

const PeriodicTable = forwardRef((props: PeriodicTableProps, ref) => {
  let grid = [];
  let elementNumber = 0;
  let highlightHash = new Map();

  for (let elementNumber in props.elementList) {
    highlightHash.set(props.elementList[elementNumber], true);
  }

  for (let y = 0; y < 11; y++) {
    let row = [];
    for (let x = 0; x < 18; x++) {
      let element = elementFile.elements[elementNumber];

      let elementProps: PeriodicElementProps = {
        element: element,
        isHighlight: highlightHash.has(element.number)
          ? highlightHash.get(element.number)
          : false,
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
        elementProps.element = null;
      }

      let elementHtml = (
        <PeriodicElement
          key={crypto.randomUUID()}
          {...elementProps}
        ></PeriodicElement>
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
