import "./StartPage.css";
import { useEffect, useState } from "react";

function StartPage() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Track mouse movement
  const handleMouseMove = (event: any) => {
    const card = document.getElementById("help-card");
    const { clientX: mouseX, clientY: mouseY } = event;

    if (card == null) return;
    // Get the card's position and dimensions
    const { left, top, width, height } = card.getBoundingClientRect();

    // Calculate the center of the card
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate the mouse position relative to the card's center
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    // Set the rotation based on mouse movement
    setRotation({
      x: (deltaY / height) * 5, // Tilt card vertically
      y: (deltaX / width) * -5, // Tilt card horizontally
    });
  };

  useEffect(() => {
    // Add mouse move event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div id="help-card-container">
        <div
          id="help-card"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          <h2>What is this app for?...</h2>
          <br />
          <h3>Originally, to find the atomic weights of atoms and molecules</h3>
          <p>Ex. "(NH4)3PO4" would be (NH₄)₃PO₄</p>
          <br></br>

          <br></br>
          <h3>But theres more features in the textbox...</h3>
          <p>
            A single element in the textbox displays more info about that
            element
          </p>
          <br />
          <p>Prefix "$" shows 3d simulations of any organic molecule</p>
          <p>Ex. $cyclohexanol</p>
          <br />
          <p>Prefix "?" starts your personal AP Chemistry helper :o</p>
          <p>Ex. ?How do I do stoicheometry</p>
        </div>
      </div>
    </>
  );
}

export default StartPage;
