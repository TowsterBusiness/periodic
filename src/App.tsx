import { KeyboardEventHandler, useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import MoleculeDisplay from "./widget/MoleculeDisplay";
import AtomicMass from "./widget/AtomicMass";
import { getElementBySymbol } from "./widget/AtomicMass";
import {
  chemTree,
  findBranch,
  rankBranches,
  sendChatRequest,
  sendContent,
} from "./Backend";
import EasterEgg from "./widget/EasterEggs";
import AtomicDisplay from "./widget/AtomDisplay";
import StartPage from "./widget/StartPage";

let IPAdress: String;
let textBoxText: String;

let finalPrompt: String = "";

enum States {
  ATOMIC_MASS,
  MOLECULE_STRUCTURE,
  CHAT_BOT,
  EASTER_EGG,
  ATOMIC_DISPLAY,
  START_PAGE,
}

enum ChatBotStates {
  LOADING,
  RESPONSE,
  WAITING,
}

let actualText = "";

function App() {
  const [widgetInput, setWidgetInput] = useState("");
  const [state, setState] = useState(States.START_PAGE);
  const [chatBotState, setChatBotState] = useState(ChatBotStates.WAITING);
  const [chatBotOutput, setChatBotOutput] = useState("");

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

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

    if (editedText == "") {
      setState(States.START_PAGE);
      setIsSuggestionsVisible(false);
    } else if (editedText.charAt(0) == "$") {
      setState(States.MOLECULE_STRUCTURE);
      setWidgetInput(editedText.slice(1));
      setIsSuggestionsVisible(false);
    } else if (editedText.charAt(0) == "?") {
      setState(States.CHAT_BOT);
      let text = editedText.slice(1);

      finalPrompt = text;
      setIsSuggestionsVisible(false);
    } else if (editedText.charAt(0) == ":" && editedText.charAt(1) == ")") {
      setState(States.EASTER_EGG);
      setWidgetInput(editedText.slice(2).toLowerCase());
      setIsSuggestionsVisible(false);
    } else {
      let element = getElementBySymbol(editedText);

      if (element == null) {
        setState(States.ATOMIC_MASS);
        actualText = editedText;
        console.log(actualText);
        setWidgetInput(editedText);

        let branch = findBranch(chemTree, editedText);
        if (branch == undefined || branch.children.length == 0) {
          setIsSuggestionsVisible(false);
        } else {
          let rankedMolecules = rankBranches(branch, 5).map(
            (value) => editedText + value
          );
          console.log(rankedMolecules);
          setFilteredSuggestions(rankedMolecules);
          setIsSuggestionsVisible(true);
        }

        setActiveSuggestionIndex(-1);
      } else {
        setState(States.ATOMIC_DISPLAY);

        setWidgetInput(editedText);
      }
    }
  };

  const renderChatBot = () => {
    if (chatBotState == ChatBotStates.WAITING) {
      return <h3 id="chattext">...Waiting for a prompt</h3>;
    } else if (chatBotState == ChatBotStates.LOADING) {
      return <img src="/loadingAnimation.gif" alt="Loading..."></img>;
    } else if (chatBotState == ChatBotStates.RESPONSE) {
      return (
        <div id="chattext">
          <ReactMarkdown>{chatBotOutput}</ReactMarkdown>
        </div>
      );
    }
  };

  // Handle key down events for keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === "ArrowUp") {
      // Up arrow - move to the previous suggestion
      if (activeSuggestionIndex > -1) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
        if (activeSuggestionIndex - 1 == -1) {
          console.log(actualText);
          setWidgetInput(actualText);
        } else {
          setWidgetInput(filteredSuggestions[activeSuggestionIndex]);
        }
      }
    } else if (key === "ArrowDown") {
      // Down arrow - move to the next suggestion
      if (activeSuggestionIndex < filteredSuggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);

        setWidgetInput(filteredSuggestions[activeSuggestionIndex + 1]);
      }
    }
  };

  // Render the suggestions dropdown
  const renderSuggestions = () => {
    return (
      <ul className="suggestions-list">
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={suggestion}
            className={`suggestion-item ${
              index === activeSuggestionIndex ? "active" : ""
            }`}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    );
  };

  const onSubmit = (evt: any) => {
    evt.preventDefault();

    if (state == States.CHAT_BOT && chatBotState != ChatBotStates.LOADING) {
      console.log("Submitted", finalPrompt);
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
      console.log("Submitted", widgetInput);
      sendContent(widgetInput);
    }
  };

  return (
    <div className="App">
      <h1>⚛️ Periodic ⚛️</h1>

      <form id="main-input" className="noselect" onSubmit={onSubmit}>
        <div id="text-box-outline">
          <input
            type="text"
            id="text-box"
            autoComplete="off"
            autoCapitalize="off"
            onKeyDown={onKeyDown}
            onInput={onInputHandler}
          />
        </div>
      </form>

      <div className="autocomplete-container">
        {isSuggestionsVisible ? renderSuggestions() : <></>}
      </div>

      {state == States.START_PAGE ? <StartPage></StartPage> : <></>}
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
      {state == States.ATOMIC_DISPLAY ? (
        <AtomicDisplay elementName={widgetInput}></AtomicDisplay>
      ) : (
        <></>
      )}

      <h6>
        All elements derived from{" "}
        <a
          className="link"
          href="https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json"
        >
          here
        </a>
        <br />
        All molecules from{" "}
        <a href="https://github.com/OpenChemistry/molecules" className="link">
          here
        </a>
        <br />
        Socials: <span> </span>
        <a href="https://discord.gg/NnT5werabb" className="link">
          discord
        </a>
      </h6>
    </div>
  );
}

export default App;
