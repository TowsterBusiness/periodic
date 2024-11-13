import React, { useRef } from "react";
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

function AtomicMass(props: AtomicMassProp) {
  let output = "Waiting...";
  let formula = "Waiting...";
  let elementList = [elementFile.elements[0]];
  let isEval = false;
  const refPeriodicTable = useRef<any>(null);

  let text = props.text;

  if (text == "") {
    output = "Waiting...";
    formula = "Waiting...";
  }

  if (RegExp("\\*|\\/|\\+|-", "g").test(text)) {
    try {
      output = calculatorFromString(text).toPrecision(10);
      formula = "";
      isEval = true;
    } catch (error) {}
  } else {
    isEval = false;
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

    var moleculeWeight: number = atomicMassFromString(text);
    console.log(moleculeWeight);
    output = moleculeWeight.toPrecision(10);

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
        {isEval ? (
          <></>
        ) : (
          elementList.map((element, index) => {
            return <ElementCard key={index} element={element}></ElementCard>;
          })
        )}
      </div>

      {isEval ? <></> : <PeriodicTable ref={refPeriodicTable}></PeriodicTable>}
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

function calculatorFromString(s: string): number {
  var pointer1: number = 0;
  let builderString = s;
  const sLength = s.length;
  while (pointer1 < sLength) {
    console.log(s.charAt(pointer1));
    if (s.charAt(pointer1) == "(") {
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

      console.log(passStr);

      if (passStr != null) {
        if (RegExp("\\*|\\/|\\+|-", "g").test(passStr)) {
          builderString = builderString.replace(
            passStr,
            calculatorFromString(passStr).toString()
          );
        } else {
          builderString = builderString.replace(
            passStr,
            atomicMassFromString(passStr).toString()
          );
        }
      }
    } else {
      pointer1++;
    }
  }
  console.log(builderString);
  return parseFloat(eval(builderString));
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
