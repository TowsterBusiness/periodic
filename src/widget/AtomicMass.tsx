import React, { useState } from "react";
import elementFile from "../assets/periodic_elements.json";
import { ElementJson } from "../ElementDataTypes";
import ElementCard from "../ElementCard";
import PeriodicTable from "../PeriodicTable";

export interface AtomicMassProp {
  text: string;
}

let lastChemicalName: String = "";
let lastChemicalTime: number = Number.MAX_VALUE;
let previousChemicalList: Array<string>;
const refPeriodicTable: React.ForwardedRef<HTMLDivElement> =
  React.createRef<HTMLDivElement>();

function AtomicMass(props: AtomicMassProp) {
  let output = "Waiting...";
  let formula = "Waiting...";
  let elementList = [elementFile.elements[0]];

  let text = props.text;

  if (text == "") {
    output = "Waiting...";
    formula = "Waiting...";
  }

  if (RegExp("\\*|\\/|\\+|-", "g").test(text)) {
    console.log("Using eval");
    try {
      output = eval(text);
      formula = "";
    } catch (error) {}
  } else {
    let tempFormula = atomicFormulaFromString(text);
    if (tempFormula != null) {
      formula = tempFormula;
    }

    // Chemical Number Check
    elementFile["elements"].forEach((element: ElementJson) => {
      if (text == element.number.toString()) {
        output = element.name;
      }
    });

    var chemicalList: Array<string> = text
      .replaceAll(new RegExp("\\(|\\)|[0-9]|\\.", "g"), "")
      .split(new RegExp("(?=[A-Z])"));
    console.log(chemicalList);

    elementList = [];

    var moleculeWeight: number = atomicMassFromString(text);
    console.log(calculatorFromString(text));

    chemicalList.forEach((chemical) => {
      var element: ElementJson | null = getElementBySymbol(chemical);
      if (element != null) {
        if (refPeriodicTable != null && refPeriodicTable.current) {
          refPeriodicTable.current.triggerHighlight(element.number, true);
        }
        elementList.push(element);
      }
    });

    if (previousChemicalList != null) {
      previousChemicalList.forEach((pElement) => {
        let hasElement: boolean = false;
        chemicalList.forEach((cElement) => {
          if (pElement == cElement) hasElement = true;
        });
        if (hasElement == false) {
          refPeriodicTable?.current?.triggerHighlight(
            getElementBySymbol(pElement)?.number,
            false
          );
        }
      });
    }
    previousChemicalList = chemicalList;

    elementList = elementList;
    output = Math.round((moleculeWeight * 1000) / 1000).toString();
    // console.log(Date.now() - lastChemicalTime);
    // if (Date.now() > lastChemicalTime + 3000 && lastChemicalName != "") {
    //   sendContent(IPAdress, lastChemicalName);
    // }
    // lastChemicalTime = Date.now();
    // lastChemicalName = text;
  }

  return (
    <>
      <div id="container"></div>
      <h1 id="formula">{formula}</h1>
      <h1 id="test">{output}</h1>

      <div>
        {elementList.map((element, index) => {
          return <ElementCard key={index} element={element}></ElementCard>;
        })}
      </div>
      <PeriodicTable ref={refPeriodicTable}></PeriodicTable>
    </>
  );
}

function getElementBySymbol(s: string): ElementJson | null {
  var elementFin = null;
  elementFile["elements"].forEach((element: ElementJson) => {
    if (s == element.symbol) {
      elementFin = element;
    }
  });
  return elementFin;
}

function calculatorFromString(s: String): number {
  let builder: Array<number | String> = [];
  let individualBuilder: String = "";

  for (let pointer = 0; pointer < s.length; pointer++) {
    const c = s.charAt(pointer);
    if (RegExp("[0-9]").test(c)) {
      individualBuilder += c;
    } else if (RegExp("\\*|\\/|\\+|-").test(c)) {
      builder.push(parseFloat(individualBuilder.toString()));
      console.log("builder1", builder);
      individualBuilder = "";
      builder.push(c);
      console.log("builder2", builder);
    }
    pointer++;
  }
  builder.push(parseFloat(individualBuilder.toString()));

  console.log("builder", builder);

  for (let i = 0; i < builder.length; i++) {}
  return 0;
}

function atomicMassFromString(s: string): number {
  var pointer1: number = 0;

  var numberBuilder = 0;

  while (pointer1 < s.length) {
    if (RegExp("[A-Z]").test(s.charAt(pointer1))) {
      let stringBuilder = s.charAt(pointer1);
      pointer1++;
      while (RegExp("[a-z]").test(s.charAt(pointer1))) {
        // Error here for 1 lettered items
        stringBuilder += s.charAt(pointer1);
        pointer1++;
      }

      var coefficientBuilder = 1;
      if (s.charAt(pointer1) == ".") {
        coefficientBuilder = 0;
        pointer1++;
        while (
          pointer1 < s.length &&
          new RegExp("[0-9]").test(s.charAt(pointer1))
        ) {
          coefficientBuilder *= 10;
          coefficientBuilder += parseInt(s.charAt(pointer1));
          pointer1++;
        }
      }

      let element = getElementBySymbol(stringBuilder);
      if (element != null) {
        numberBuilder += element.atomic_mass * coefficientBuilder;
      }
    } else if (s.charAt(pointer1) == "(") {
      var startPointer = pointer1;
      var passStr: string | null = null;
      var counter: number = 0;
      while (pointer1 < s.length) {
        if (s.charAt(pointer1) == "(") {
          counter++;
        } else if (s.charAt(pointer1) == ")") {
          counter--;
          if (counter <= 0) {
            passStr = s.substring(startPointer + 1, pointer1);
            pointer1++;
            break;
          }
        }
        pointer1++;
      }

      var coefficientBuilder = 1;
      if (s.charAt(pointer1) == ".") {
        coefficientBuilder = 0;
        pointer1++;
        while (
          pointer1 < s.length &&
          new RegExp("[0-9]").test(s.charAt(pointer1))
        ) {
          coefficientBuilder *= 10;
          coefficientBuilder += parseInt(s.charAt(pointer1));
          pointer1++;
        }
        console.log(coefficientBuilder);
      }

      if (passStr == null) {
        console.error(
          "Hey!, ",
          pointer1,
          "index, ",
          s.charAt(pointer1),
          "doesn't have an element"
        );
      } else {
        numberBuilder += atomicMassFromString(passStr) * coefficientBuilder;
      }
    } else {
      pointer1++;
    }
  }

  return numberBuilder;
}

function atomicFormulaFromString(s: String): string | void {
  let index: number = 0;
  let stringBuilder: string = "";
  while (index < s.length) {
    if (s.charAt(index) != ".") {
      stringBuilder += s.charAt(index);
      index++;
      continue;
    }

    index++;
    if (s.charCodeAt(index) < 49 || s.charCodeAt(index) > 59) return;

    while (s.charCodeAt(index) >= 49 && s.charCodeAt(index) <= 59) {
      stringBuilder += String.fromCharCode(s.charCodeAt(index) + 8272);
      index++;
    }
  }
  return stringBuilder;
}

export default AtomicMass;
