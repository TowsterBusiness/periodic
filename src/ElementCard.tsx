import { FormEventHandler, useState } from "react";
import "./ElementCard.css";
// import { ElementJson } from "./ElementDataTypes";

import elementFile from "./assets/periodic_elements.json";

export type ElementJson = (typeof elementFile.elements)[0];

export interface ElementCardProp {
  element: ElementJson;
}

function ElementCard(props: ElementCardProp) {
  return (
    <div className="container">
      <h3 id="atm-number">{props.element.number}</h3>
      <h2 id="atm-symbol">{props.element.symbol}</h2>
      <h3 id="atm-name">{props.element.name}</h3>
      <h3 id="atm-weight">{props.element.atomic_mass}</h3>
    </div>
  );
}

export default ElementCard;
