import React, { useRef } from "react";
import elementFile from "../assets/periodic_elements.json";
import { ElementJson } from "../ElementDataTypes";
import ElementCard from "../ElementCard";
import PeriodicTable from "../PeriodicTable";
import { sendContent } from "../Backend";

export interface AtomicMassProp {
  text: string;
}

let lastChemicalName: string = "";
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

    elementList = [];

    chemicalList.forEach((chemical) => {
      var element: ElementJson | null = getElementBySymbol(chemical);
      if (element != null) {
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

    var moleculeWeight: number = atomicMassFromString2(text);
    output = moleculeWeight.toPrecision(10);

    console.log(Date.now() - lastChemicalTime);
    if (Date.now() > lastChemicalTime + 3000 && lastChemicalName != "") {
      console.log("Submitted", lastChemicalName);
      sendContent(lastChemicalName);
    }
    lastChemicalTime = Date.now();
    lastChemicalName = text;
  }

  return (
    <>
      <div id="container"></div>
      <h1 id="formula">{formula}</h1>
      <h1 id="test">{output}</h1>

      {isEval ? <></> : <hr></hr>}

      <div>
        {isEval ? (
          <></>
        ) : (
          elementList.map((element, index) => {
            return <ElementCard key={index} element={element}></ElementCard>;
          })
        )}
      </div>

      {isEval ? <></> : <hr></hr>}

      {isEval ? (
        <></>
      ) : (
        <PeriodicTable
          elementList={elementList.map((element) => element.number)}
          ref={refPeriodicTable}
        ></PeriodicTable>
      )}
    </>
  );
}

export function getElementBySymbol(s: string): ElementJson | null {
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
            atomicMassFromString2(passStr).toString()
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

function atomicFormulaFromString(s: String): string | void {
  let index: number = 0;
  let stringBuilder: string = "";
  while (index < s.length) {
    if (new RegExp("[A-z]").test(s.charAt(index))) {
      stringBuilder += s.charAt(index);
      index++;
    } else if (s.charCodeAt(index) >= 48 && s.charCodeAt(index) <= 58) {
      stringBuilder += String.fromCharCode(s.charCodeAt(index) + 8272);
      index++;
    } else {
      index++;
    }
  }
  return stringBuilder;
}

function atomicMassFromString2(s: String): number {
  let pointer = 0;
  let coefficient = 0;
  while (isNumber(s.charAt(pointer))) {
    coefficient *= 10;
    coefficient += parseInt(s.charAt(pointer));
    pointer++;
  }
  if (coefficient == 0) {
    coefficient = 1;
  }

  let numberBuilder = 0;
  while (pointer < s.length) {
    const c = s.charAt(pointer);

    let currentNumber = 0;
    if (c == "(") {
      let counter: number = 1;
      let innerFormula: string = "";
      pointer++;

      while (counter > 0) {
        const innerC = s.charAt(pointer);
        if (innerC == "") {
          break;
        } else if (innerC == "(") {
          counter++;
        } else if (innerC == ")") {
          counter--;
        } else {
          innerFormula += innerC;
        }
        pointer++;
      }

      currentNumber = atomicMassFromString2(innerFormula);
    } else if (new RegExp("[A-Z]").test(c)) {
      let elementName: string = c;
      pointer++;
      while (new RegExp("[a-z]").test(s.charAt(pointer))) {
        elementName += s.charAt(pointer);
        pointer++;
      }
      let element = getElementBySymbol(elementName);
      if (element) {
        currentNumber = element.atomic_mass;
      } else {
        console.error();
        currentNumber = 0;
      }
    } else {
      pointer++;
    }

    if (isNumber(s.charAt(pointer))) {
      let innerCoefficient = 0;
      while (isNumber(s.charAt(pointer))) {
        innerCoefficient *= 10;
        innerCoefficient += parseInt(s.charAt(pointer));
        pointer++;
      }
      numberBuilder += currentNumber * innerCoefficient;
    } else {
      numberBuilder += currentNumber;
    }
  }

  return numberBuilder * coefficient;
}

const isNumberRegEx = new RegExp("[0-9]");
function isNumber(c: string) {
  return isNumberRegEx.test(c);
}

export default AtomicMass;
