import React, { useEffect, useRef } from "react";
import { ElementJson } from "../ElementDataTypes";
import PeriodicTable from "../PeriodicTable";
import { getElementBySymbol } from "./AtomicMass";

export interface AtomDisplayProps {
  elementName: string;
}

function AtomDisplay(props: AtomDisplayProps) {
  const refPeriodicTable = useRef<any>(null);
  const element = getElementBySymbol(props.elementName);

  if (element == null) return <></>;

  useEffect(() => {
    if (refPeriodicTable.current != null)
      refPeriodicTable.current.triggerHighlight(element.number, true);
  });

  return (
    <>
      <div id="container"></div>
      <h1 id="test">{element.atomic_mass}</h1>

      <hr></hr>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={element.image.url}
          style={{
            height: "140px",
            borderRadius: "10px",
          }}
          alt=""
        />
        <div
          className="container"
          style={{
            width: "300px",
          }}
        >
          <h3 id="atm-number">{element.number}</h3>
          <h2 id="atm-symbol">{element.symbol}</h2>
          <h3 id="atm-name">{element.name}</h3>
          <h4>{element.electron_configuration}</h4>
          <h4>{element.electron_configuration_semantic}</h4>
        </div>

        <img
          src={element.bohr_model_image ? element.bohr_model_image : ""}
          style={{
            height: "140px",
            borderRadius: "10px",
          }}
          alt=""
        />
      </div>

      <hr></hr>

      {<PeriodicTable elementList={[element.number]}></PeriodicTable>}
    </>
  );
}

export default AtomDisplay;
