import "./Suggestions.css";

export interface SuggestionsProp {
  suggestions: Array<String>;
}

function Suggestions(props: SuggestionsProp) {
  return (
    <div className="suggestion_container">
      {props.suggestions.map((name) => {
        return <div className="name">{name}</div>;
      })}
    </div>
  );
}

export default Suggestions;
