export interface EasterEggProp {
  text: string;
}

function EasterEgg(props: EasterEggProp) {
  let text = props.text;

  if (text == ":)") {
    return <h1>Yippie!!!! 🎉</h1>;
  } else if (text == ":(") {
    return <h1>Naur 😭😭😭😭</h1>;
  } else if (text == "i love you") {
    return <h1>I love me too!</h1>;
  } else if (text == "<3") {
    return <h1>{"<3 <3 <3 <3"}</h1>;
  } else if (text == "good kid") {
    return (
      <h1>
        <a href="https://www.youtube.com/watch?v=s1EnIwFnLyQ">peak?</a>
      </h1>
    );
  } else if (text == "who made these") {
    return <h1>{"Alyssa :("}</h1>;
  }
}

export default EasterEgg;
