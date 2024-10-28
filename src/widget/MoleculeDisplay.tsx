import React, { useState } from "react";
import MoleculeModel from "../MoleculeModel";
import Suggestions from "../Suggestions";
import moleculeListFile from "../assets/molecule_list.json";

export interface MoleculeDisplayProp {
  text: string;
}

function MoleculeDisplay(props: MoleculeDisplayProp) {
  let moleculeList = [""];
  let moleculeName = "";
  console.log(123);
  let input = props.text;

  let moleculeListTemp: string[] = searchMoleculeName(input, 5);
  moleculeList = moleculeListTemp;
  moleculeName = moleculeListTemp[0];

  return (
    <>
      <Suggestions suggestions={moleculeList}></Suggestions>
      <MoleculeModel moleculeName={moleculeName}></MoleculeModel>
    </>
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

export default MoleculeDisplay;
