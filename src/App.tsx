import { FormEventHandler, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import elementFile from "./assets/periodic_elements.json";

type ElementJson = (typeof elementFile.elements)[0];

function App() {
  const [output, setOutput] = useState("Waiting...");

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
  };

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
  );
}

export default App;
