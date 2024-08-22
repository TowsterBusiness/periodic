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
        handleHighlight(isHighlight);
      },
    };
  });

  function handleHighlight(isHighlight: boolean) {
    if (isHighlight) {
      highLightTrue();
    } else {
      setTextColor("#fffff");
      setFontWeight(500);
    }
  }

  function highLightTrue() {
    console.log(123);
    setTextColor("#f0f55d");
    setFontWeight(800);
  }

  if (props.element == null) {
    return <span className="space-periodic"></span>;
  } else {
    return (
      <span
        className="element-periodic"
        style={{ color: textColor, fontWeight: fontWeight }}
        onClick={highLightTrue}
      >
        {props.element.symbol}
      </span>
    );
  }
});

export default PeriodicElement;
