import { FormEventHandler, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import elementFile from "./assets/periodic_elements.json";

type ElementJson = (typeof elementFile.elements)[0];

function App() {
  const [output, setOutput] = useState("Waiting...");
  const [elementList, setElementList] = useState([elementFile.elements[0]]);

  var textbox: HTMLInputElement = document.getElementById(
    "text-box"
  ) as HTMLInputElement;

  var onInputHandler = (evt: any) => {
    var editedText: string = evt.target.value;

    if (editedText == "") {
      setOutput("Waiting...");
    }

    // Chemical Number Check
    elementFile["elements"].forEach((element: ElementJson) => {
      if (editedText == element.number.toString()) {
        setOutput(element.name);
      }
    });

    var chemicalList: Array<string> = editedText
      .replaceAll(new RegExp("\\(|\\)|[0-9]|\\.", "g"), "")
      .split(new RegExp("(?=[A-Z])"));
    console.log(chemicalList);

    var elementList: Array<ElementJson> = [];
    var moleculeWeight: number = atomicMassFromString(editedText);

    setElementList(elementList);
    setOutput(moleculeWeight.toPrecision(4).toString());
  return (
    <div className="App">
      <h1>⚛️ Periodic ⚛️</h1>
      <p>Finds the atomic weights of atoms and molecules</p>
      <p>Ex. "(NH.4).3PO.4" would be (NH₄)₃PO₄</p>
      <form id="main-input" className="noselect">
        <input
          type="text"
          id="text-box"
          autoComplete="off"
          onInput={onInputHandler}
        />
      </form>
      <div id="container"></div>
      <h1 id="test">{output}</h1>
      <h6>
        All elements derived from{" "}
        <a href="https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json">
          here
        </a>
      </h6>
    </div>
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

export default App;
