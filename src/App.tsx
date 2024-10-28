import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import MoleculeDisplay from "./widget/MoleculeDisplay";
import AtomicMass from "./widget/AtomicMass";
import { sendChatRequest } from "./Backend";
import EasterEgg from "./widget/EasterEggs";

let IPAdress: String;
let textBoxText: String;

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
  const [widgetInput, setWidgetInput] = useState("");
  const [state, setState] = useState(States.ATOMIC_MASS);
  const [chatBotState, setChatBotState] = useState(ChatBotStates.WAITING);
  const [chatBotOutput, setChatBotOutput] = useState("");
  const [easterEggOutput, setEasterEggOutput] = useState(<></>);

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
      setWidgetInput(editedText.slice(1));
    } else if (editedText.charAt(0) == "?") {
      setState(States.CHAT_BOT);
      let text = editedText.slice(1);

      finalPrompt = text;
    } else if (editedText.charAt(0) == ":" && editedText.charAt(1) == ")") {
      setState(States.EASTER_EGG);
      setWidgetInput(editedText.slice(2).toLowerCase());
    } else {
      setState(States.ATOMIC_MASS);
      setWidgetInput(editedText);
    }
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

  const onSubmit = (evt: any) => {
    evt.preventDefault();
    console.log(`Submitted`);
    // if (state == States.CHAT_BOT) {
    //   const fetchData = async () => {
    //     try {
    //       // Using Axios
    //       setChatBotState(ChatBotStates.LOADING);
    //       const response = await sendChatRequest(finalPrompt);
    //       setChatBotState(ChatBotStates.RESPONSE);
    //       setChatBotOutput(response); // Assuming we're interested in the title
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };

    //   fetchData();
    // }
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

      {state == States.MOLECULE_STRUCTURE ? (
        <MoleculeDisplay text={widgetInput}></MoleculeDisplay>
      ) : (
        <></>
      )}
      {state == States.ATOMIC_MASS ? (
        <AtomicMass text={widgetInput}></AtomicMass>
      ) : (
        <></>
      )}
      {state == States.CHAT_BOT ? renderChatBot() : <></>}
      {state == States.EASTER_EGG ? (
        <EasterEgg text={widgetInput}></EasterEgg>
      ) : (
        <></>
      )}

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

export default App;
