import "./ElementCard.css";
import { ElementJson } from "./ElementDataTypes";

export interface ElementCardProp {
  element: ElementJson;
}

function ElementCard(props: ElementCardProp) {
  let oxidization: String = "";
  if (props.element.group <= 2) {
    oxidization = "+" + props.element.group;
  } else if (props.element.group <= 12) {
    oxidization = "+?";
  } else if (props.element.group <= 14) {
    oxidization = "+" + (props.element.group - 10);
  } else if (props.element.group <= 17) {
    oxidization = "-" + (18 - props.element.group);
  } else {
    oxidization = "+0";
  }

  return (
    <div className="container">
      <h3 id="atm-number">{props.element.number}</h3>
      <h2 id="atm-symbol">{props.element.symbol}</h2>
      <h3 id="atm-name">{props.element.name}</h3>
      <h3 id="atm-weight">
        {Math.round(props.element.atomic_mass * 100) / 100}
      </h3>
      <h3 id="atm-oxidization">{oxidization}</h3>
    </div>
  );
}

export default ElementCard;
