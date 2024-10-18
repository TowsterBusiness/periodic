import React, { MouseEventHandler, useEffect, useState } from "react";
import { MoleculeJson } from "./ElementDataTypes";
import acetoneMoleculeFile from "./assets/molecules/cyclobutane.json";
import elementListFile from "./assets/element_list.json";

export interface MoleculeModelProp {
  moleculeName: String;
}

let isMouseDown = false;
let prevX = 0;
let prevY = 0;

function MoleculeModel(props: MoleculeModelProp) {
  let canvasRef: React.RefObject<HTMLCanvasElement> =
    React.createRef<HTMLCanvasElement>();
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [moleculeData, setMoleculeData] = useState(acetoneMoleculeFile);

  const elementList = elementListFile.elements;

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const module = await import(
          `./assets/molecules/${props.moleculeName}.json`
        );
        setMoleculeData(() => module.default);
      } catch (error) {
        console.error("Error loading component:", error);
        setMoleculeData(acetoneMoleculeFile);
      }
    };

    loadComponent();
  }, [props.moleculeName]);

  useEffect(() => {
    console.log("Effect Run");

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");

      canvas.width = 400;
      canvas.height = 400;
      let fovX = 90;
      let fovY = 90;
      let cameraX = 0;
      let cameraY = 0;
      let cameraZ = -10;
      let pitch = yPos;
      let yaw = xPos;
      let roll = 0;
      let zoom = 5;

      if (context) {
        context.fillStyle = "#1c1c1c";
        context.fillRect(0, 0, 400, 400);

        let orderedAtoms: Array<Array<number>> = [];
        let indexAtoms: Array<Array<number>> = [];
        let bonds: Array<Array<number>> = [];

        for (let i = 0; i < moleculeData.atoms.coords["3d"].length; i += 3) {
          let atom: Array<number> = [0, 0, 0, 0];

          atom[0] = Math.floor(i / 3);

          let point: number[] = [0, 0, 0];
          point[0] = moleculeData.atoms.coords["3d"][i];
          point[1] = moleculeData.atoms.coords["3d"][i + 1];
          point[2] = moleculeData.atoms.coords["3d"][i + 2];

          point = rotate(point, pitch, yaw, roll);

          point[0] -= cameraX;
          point[1] -= cameraY;
          point[2] -= cameraZ;

          let x =
            (toDegrees(Math.atan2(point[2], point[1]) / fovX) * canvas.width) /
            2;
          x = (x - 200) * zoom + 200;
          let y =
            (toDegrees(Math.atan2(point[2], point[0]) / fovY) * canvas.height) /
            2;
          y = (y - 200) * zoom + 200;
          let z = distance(distance(point[2], point[1]), point[0]);

          atom[1] = x;
          atom[2] = y;
          atom[3] = z;

          let point2: number[] = [x, y];
          indexAtoms.push(point2);

          orderedAtoms.push(atom);
        }

        orderedAtoms.sort((a: Array<number>, b: Array<number>) => {
          return b[3] - a[3];
        });

        for (let i = 0; i < moleculeData.bonds.order.length; i++) {
          let bond: Array<number> = [0, 0, 0];

          bond[0] = moleculeData.bonds.connections.index[i * 2];
          bond[1] = moleculeData.bonds.connections.index[i * 2 + 1];
          bond[2] = moleculeData.bonds.order[i];

          bonds.push(bond);
        }

        orderedAtoms.forEach((atom: Array<number>) => {
          context.fillStyle =
            elementList[moleculeData.atoms.elements.number[atom[0]] - 1].color;
          let fontSize = 140 - atom[3] * 10;
          context.font = fontSize + "px Arial";
          context.fillText(
            elementList[moleculeData.atoms.elements.number[atom[0]] - 1].symbol,
            atom[1],
            atom[2]
          );

          //TODO: Draw Bonds

          for (let i = 0; i < bonds.length; i++) {
            if (bonds[i][0] == atom[0] || bonds[i][1] == atom[0]) {
              let point1 = [
                indexAtoms[bonds[i][0]][0],
                indexAtoms[bonds[i][0]][1],
              ];
              let point2 = [
                indexAtoms[bonds[i][1]][0],
                indexAtoms[bonds[i][1]][1],
              ];

              point1[0] += fontSize / 2;
              point1[1] -= fontSize / 2;
              point2[0] += fontSize / 2;
              point2[1] -= fontSize / 2;

              let normal = normalize2d(subtractVector2d(point1, point2));

              point1 = subtractVector2d(point1, multiplyVector2d(normal, 20));
              point2 = addVector2d(point2, multiplyVector2d(normal, 20));

              //TODO: Draw Bonds
              context.beginPath();

              context.moveTo(point1[0], point1[1]);
              context.lineTo(point2[0], point2[1]);
              context.lineCap = "round";
              context.strokeStyle = "#ab68d3";
              context.lineWidth = 5;
              context.stroke();

              bonds.splice(i, 1);
              i--;
            }
          }
        });
      }
    }
  });

  const mouseMoveHandler = (evt: any) => {
    if (isMouseDown) {
      const x = evt.nativeEvent.offsetX;
      const y = evt.nativeEvent.offsetY;

      setXPos(xPos + prevX - x);
      setYPos(yPos + prevY - y);
      prevX = x;
      prevY = y;
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={(evt) => {
          prevX = evt.nativeEvent.offsetX;
          isMouseDown = true;
        }}
        onMouseUp={() => {
          isMouseDown = false;
        }}
        onMouseMove={mouseMoveHandler}
      />
    </div>
  );
}

function rotate(
  a: number[],
  pitch: number,
  yaw: number,
  roll: number
): number[] {
  pitch = toRadians(pitch);
  let magnitude = distance(a[0], a[2]);
  let angle = Math.atan2(a[2], a[0]) + pitch;
  a[0] = Math.cos(angle) * magnitude;
  a[2] = Math.sin(angle) * magnitude;

  yaw = toRadians(yaw);
  magnitude = distance(a[1], a[2]);
  angle = Math.atan2(a[2], a[1]) + yaw;
  a[1] = Math.cos(angle) * magnitude;
  a[2] = Math.sin(angle) * magnitude;

  roll = toRadians(roll);
  magnitude = distance(a[0], a[1]);
  angle = Math.atan2(a[1], a[0]) + roll;
  a[0] = Math.cos(angle) * magnitude;
  a[1] = Math.sin(angle) * magnitude;

  return a;
}

function toRadians(a: number): number {
  return a * (Math.PI / 180);
}

function toDegrees(a: number): number {
  return a * (180 / Math.PI);
}

function distance(a: number, b: number): number {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function normalize2d(a: number[]): number[] {
  let vector = [a[0], a[1]];
  let length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  vector[0] /= length;
  vector[1] /= length;
  return vector;
}

function addVector2d(a: number[], b: number[]) {
  return [a[0] + b[0], a[1] + b[1]];
}

function subtractVector2d(a: number[], b: number[]) {
  return [a[0] - b[0], a[1] - b[1]];
}

function multiplyVector2d(a: number[], s: number) {
  return [a[0] * s, a[1] * s];
}

export default MoleculeModel;
