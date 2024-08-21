import React, { useImperativeHandle, forwardRef, useState } from "react";
import elementFile from "./assets/periodic_elements.json";
import { ElementJson } from "./ElementDataTypes";
import "./PeriodicElement.css";

export interface PeriodicElementProps {
  element: ElementJson | null;
  highlight: boolean;
}

const PeriodicElement = forwardRef((props: PeriodicElementProps, ref) => {
  const [backgroundColor, setBackgroundColor] = useState("#00000000");

  useImperativeHandle(ref, () => ({
    triggerHighlight: (isHighlight: boolean) => {
      if (isHighlight) {
        setBackgroundColor("#f0f55d0ff");
      } else {
        setBackgroundColor("#00000000");
      }
    },
  }));

  if (props.element == null) {
    return <span className="space-periodic"></span>;
  } else {
    return (
      <span
        className="element-periodic"
        style={{ backgroundColor: backgroundColor }}
      >
        {props.element.symbol}
      </span>
    );
  }
});

export default PeriodicElement;
