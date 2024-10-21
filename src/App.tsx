import React, { useState } from "react";
import "./App.css";
import PeriodicTable from "./PeriodicTable";
import elementFile from "./assets/periodic_elements.json";
import ElementCard from "./ElementCard";
import { ElementJson } from "./ElementDataTypes";
import moleculeListFile from "./assets/molecule_list.json";
import Suggestions from "./Suggestions";
import MoleculeModel from "./MoleculeModel";
import ReactMarkdown from "react-markdown";

let previousChemicalList: Array<string>;
let IPAdress: String;
let textBoxText: String;
let lastChemicalName: String = "";
let lastChemicalTime: number = Number.MAX_VALUE;
let finalPrompt: String = "";

enum States {
  ATOMIC_MASS,
  MOLECULE_STRUCTURE,
  CHAT_BOT,
  EASTER_EGG,
}

enum ChatBotStates {
  LOADING,
  RESPONSE,
  WAITING,
}

function App() {
  const [output, setOutput] = useState("Waiting...");
  const [formula, setFormula] = useState("Waiting...");
  const [elementList, setElementList] = useState([elementFile.elements[0]]);
  const [moleculeList, setMoleculeList] = useState([""]);
  const [moleculeName, setMoleculeName] = useState("");
  const [state, setState] = useState(States.ATOMIC_MASS);
  const [chatBotState, setChatBotState] = useState(ChatBotStates.WAITING);
  const [chatBotOutput, setChatBotOutput] = useState("");
  const [easterEggOutput, setEasterEggOutput] = useState(<></>);
  const refPeriodicTable: React.ForwardedRef<any> =
    React.createRef<HTMLDivElement | null>();

  // Future databasing program for: common formulas or molcules ect
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      IPAdress = data.ip;
    })
    .catch((error) => {
      console.error("Error fetching IP address:", error);
    });

  var textbox: HTMLInputElement = document.getElementById(
    "text-box"
  ) as HTMLInputElement;

  var onInputHandler = (evt: any) => {
    var editedText: string = evt.target.value;
    textBoxText = editedText;

    if (editedText.charAt(0) == "$") {
      setState(States.MOLECULE_STRUCTURE);
      let text = editedText.slice(1);
      let moleculeListTemp: string[] = searchMoleculeName(text, 5);
      setMoleculeList(moleculeListTemp);
      if (moleculeList.length > 1) {
        setMoleculeName(moleculeListTemp[0]);
      }
    } else if (editedText.charAt(0) == "?") {
      // setState(States.CHAT_BOT);
      // let text = editedText.slice(1);
      // finalPrompt = text;
    } else if (editedText.charAt(0) == ":" && editedText.charAt(1) == ")") {
      let text = editedText.slice(2).toLowerCase();
      setState(States.EASTER_EGG);

      if (text == ":)") {
        setEasterEggOutput(<h1>Yippie!!!! 🎉</h1>);
      } else if (text == ":(") {
        setEasterEggOutput(<h1>Naur 😭😭😭😭</h1>);
      } else if (text == "i love you") {
        setEasterEggOutput(<h1>I love me too!</h1>);
      } else if (text == "<3") {
        setEasterEggOutput(<h1>{"<3 <3 <3 <3"}</h1>);
      } else if (text == "good kid") {
        setEasterEggOutput(
          <h1>
            <a href="https://www.youtube.com/watch?v=s1EnIwFnLyQ">peak?</a>
          </h1>
        );
      } else if (text == "who made these") {
        setEasterEggOutput(<h1>{"Alyssa :("}</h1>);
      }
    } else {
      setState(States.ATOMIC_MASS);
      if (editedText == "") {
        setOutput("Waiting...");
        setFormula("Waiting...");
      }

      if (RegExp("\\*|\\/|\\+|-", "g").test(editedText)) {
        console.log("Using eval");
        try {
          setOutput(eval(editedText));
          setFormula("");
        } catch (error) {}
      } else {
        let formula = atomicFormulaFromString(editedText);
        if (formula != null) {
          setFormula(formula);
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
        console.log(calculatorFromString(editedText));

        chemicalList.forEach((chemical) => {
          var element: ElementJson | null = getElementBySymbol(chemical);
          if (element != null) {
            if (refPeriodicTable.current) {
              refPeriodicTable.current?.triggerHighlight(element.number, true);
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
              refPeriodicTable.current?.triggerHighlight(
                getElementBySymbol(pElement)?.number,
                false
              );
            }
          });
        }
        previousChemicalList = chemicalList;

        setElementList(elementList);
        setOutput((Math.round(moleculeWeight * 1000) / 1000).toString());

        // console.log(Date.now() - lastChemicalTime);
        // if (Date.now() > lastChemicalTime + 3000 && lastChemicalName != "") {
        //   sendContent(IPAdress, lastChemicalName);
        // }
        // lastChemicalTime = Date.now();
        // lastChemicalName = editedText;
      }
    }
  };

  const renderMolecule = () => {
    if (moleculeList.length > 0) {
      return (
        <>
          <Suggestions suggestions={moleculeList}></Suggestions>
          <MoleculeModel moleculeName={moleculeName}></MoleculeModel>
        </>
      );
    }
  };

  const renderAtomicMass = () => {
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
  };

  const renderChatBot = () => {
    if (chatBotState == ChatBotStates.WAITING) {
      return <h3 id="chattext">...Waiting for a prompt</h3>;
    } else if (chatBotState == ChatBotStates.LOADING) {
      return <img src="src/assets/loadingAnimation.gif" alt="Loading..."></img>;
    } else if (chatBotState == ChatBotStates.RESPONSE) {
      return (
        <p id="chattext">
          <ReactMarkdown>{chatBotOutput}</ReactMarkdown>
        </p>
      );
    }
  };

  const renderEasterEgg = () => {
    return easterEggOutput;
  };

  const onSubmit = (evt: any) => {
    evt.preventDefault();
    console.log(`Submitted`);
    if (state == States.CHAT_BOT) {
      const fetchData = async () => {
        try {
          // Using Axios
          setChatBotState(ChatBotStates.LOADING);
          const response = await sendChatRequest(finalPrompt);
          setChatBotState(ChatBotStates.RESPONSE);
          setChatBotOutput(response); // Assuming we're interested in the title
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    } else if (state == States.ATOMIC_MASS) {
      // sendContent(IPAdress, textBoxText);
    }
  };

  return (
    <div className="App">
      <h1>⚛️ Periodic ⚛️</h1>
      <p>Finds the atomic weights of atoms and molecules</p>
      <p>Ex. "(NH.4).3PO.4" would be (NH₄)₃PO₄</p>
      <p>Hint: use $ at the front to see many molecules</p>
      <form id="main-input" className="noselect" onSubmit={onSubmit}>
        <input
          type="text"
          id="text-box"
          autoComplete="off"
          autoCapitalize="off"
          onInput={onInputHandler}
        />
      </form>

      {state == States.MOLECULE_STRUCTURE ? renderMolecule() : <></>}

      {state == States.ATOMIC_MASS ? renderAtomicMass() : <></>}

      {state == States.CHAT_BOT ? renderChatBot() : <></>}

      {state == States.EASTER_EGG ? renderEasterEgg() : <></>}

      <h6>
        All elements derived from{" "}
        <a href="https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json">
          here
        </a>
        <br />
        All molecules from{" "}
        <a href="https://github.com/OpenChemistry/molecules">here</a>
        <br />
        Socials: <span> </span>
        <a href="https://discord.gg/NnT5werabb">discord</a>
      </h6>
    </div>
  );
}

function searchMoleculeName(search: string, index: number): string[] {
  let counter = 0;
  let overrideName = "";
  let list = moleculeListFile.molecule_list.filter((moleculeName) => {
    if (moleculeName == search) overrideName = moleculeName;
    if (counter > index) return false;
    if (moleculeName.search(search) != -1) {
      counter++;
      return true;
    }
    return false;
  });
  if (overrideName != "") return [overrideName];
  return list;
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

function sendContent(ip: String, content: String) {
  const data = { ip: ip, content: content };

  fetch("http://localhost:4000/counter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from server:", data);
    })
    .catch((error) => {
      console.error("Error submitting data:", error);
    });
}

async function sendChatRequest(prompt: String): Promise<string> {
  //TODO: Add checks for redundancy

  const data = { prompt: prompt };

  const response = await fetch("http://localhost:4000/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from server:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error submitting data:", error);
    });

  return response.response;
}

export default App;
