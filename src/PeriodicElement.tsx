import React, { useImperativeHandle, forwardRef, useState } from "react";
import elementFile from "./assets/periodic_elements.json";
import { ElementJson } from "./ElementDataTypes";
import "./PeriodicElement.css";

export interface PeriodicElementProps {
  element: ElementJson | null;
  highlight: boolean;
}

const PeriodicElement = forwardRef((props: PeriodicElementProps, ref) => {
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState(500);

  useImperativeHandle(ref, () => {
    return {
      triggerHighlight(isHighlight: boolean) {
        if (isHighlight) {
          setTextColor("#f0f55d0");
          setFontWeight(800);
        } else {
          setTextColor("#fffff");
          setFontWeight(500);
        }
      },
    };
  });

  if (props.element == null) {
    return <span className="space-periodic"></span>;
  } else {
    return (
      <span
        className="element-periodic"
        style={{ color: textColor, fontWeight: fontWeight }}
      >
        {props.element.symbol}
      </span>
    );
  }
});

export default PeriodicElement;
