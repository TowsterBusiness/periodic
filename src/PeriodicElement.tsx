import React, { useImperativeHandle, forwardRef, useState } from "react";
import elementFile from "./assets/periodic_elements.json";
import { ElementJson } from "./ElementDataTypes";
import "./PeriodicElement.css";

export interface PeriodicElementProps {
  element: ElementJson | null;
  isHighlight: boolean;
}

function PeriodicElement(props: PeriodicElementProps) {
  const [textColor, setTextColor] = useState({
    color: "white",
    fontWeight: 500,
  });

  if (props.element == null) {
    return <span className="space-periodic"></span>;
  } else {
    return (
      <span
        className="element-periodic"
        style={
          props.isHighlight
            ? { background: "#703194", fontWeight: 800 }
            : { color: "white", fontWeight: 500 }
        }
      >
        {props.element.symbol}
      </span>
    );
  }
}

export default PeriodicElement;
