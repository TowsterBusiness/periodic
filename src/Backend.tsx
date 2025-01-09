class ChemicalSearchTree {
  letter: string;
  children: Array<ChemicalSearchTree> = [];
  count: number = 0;
  time: number = Date.now();
  constructor(letter: string) {
    this.letter = letter;
  }

  // Method to convert the tree to a JSON object
  toJSON(): object {
    // Return an object representation of the current node
    return {
      letter: this.letter,
      count: this.count,
      children: this.children.map((child) => child.toJSON()), // Recursively map children
    };
  }

  // Static method to create an instance from a JSON object
  static fromJSON(json: any): ChemicalSearchTree {
    // Create the root node
    const root = new ChemicalSearchTree(json.letter);
    root.count = json.count;

    // Recursively create children nodes
    root.children = json.children.map((childJson: any) =>
      ChemicalSearchTree.fromJSON(childJson)
    );

    return root;
  }

  printTree() {
    console.log(this.letter, this.count);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].printTree();
    }
    console.log("No more branches");
  }
}

function addToChemTree(root: ChemicalSearchTree, word: string) {
  if (word == "") {
    root.count++;
    root.time = Date.now();
    return;
  }

  const letterAdded = word.charAt(0);
  let searchedBanch = root.children?.find(
    (branch) => branch.letter == letterAdded
  );
  if (searchedBanch == undefined) {
    let newBranch = new ChemicalSearchTree(letterAdded);
    searchedBanch = newBranch;
    root.children.push(newBranch);
  }
  if (word.length == 1) return addToChemTree(searchedBanch, "");
  addToChemTree(searchedBanch, word.substring(1));
}

export function rankBranches(root: ChemicalSearchTree, searchLength: number) {
  let rankings: string[] = [];
  let rankScores: number[] = [];
  let stack: ChemicalSearchTree[] = [root];
  let stackIndex = [0];
  let letterIndex = [""];

  while (stack[stack.length - 1].children.length != 0) {
    stack.push(stack[stack.length - 1].children[0]);
    stackIndex.push(0);
    letterIndex.push(stack[stack.length - 1].letter);
  }

  while (stack.length != 0) {
    console.log(letterIndex);
    const nodeRanking = getRankScores(stack[stack.length - 1]);
    console.log("Ranking", nodeRanking);
    let compareIndex = rankScores.findIndex((rank) => nodeRanking > rank);
    if (compareIndex === -1) compareIndex = rankings.length;
    if (letterIndex.length != 1 && compareIndex < searchLength) {
      console.log("added", letterIndex);
      rankings.splice(compareIndex, 0, letterIndex.join(""));
      rankScores.splice(compareIndex, 0, nodeRanking);

      if (rankings.length > searchLength) {
        rankings.pop();
        rankScores.pop();
      }
    }

    if (
      stack[stack.length - 1].children.length <=
      stackIndex[stackIndex.length - 1]
    ) {
      if (stack.length == 1) break;
      stack.pop();
      stackIndex.pop();
      stackIndex[stackIndex.length - 1]++;
      letterIndex.pop();
    } else {
      let next =
        stack[stack.length - 1].children[stackIndex[stackIndex.length - 1]];
      stack.push(next);
      stackIndex.push(0);
      letterIndex.push(next.letter);
    }
  }

  return rankings;
}

function getRankScores(root: ChemicalSearchTree) {
  return root.count * (0.001 / (Date.now() - root.time));
}

export function findBranch(root: ChemicalSearchTree, word: string) {
  if (word == "") return root;
  let searchedBanch = root.children?.find(
    (branch) => branch.letter == word.charAt(0)
  );
  if (searchedBanch == undefined) {
    return;
  }
  return findBranch(searchedBanch, word.substring(1));
}

export let chemTree: ChemicalSearchTree = new ChemicalSearchTree("");

export function sendContent(content: string) {
  addToChemTree(chemTree, content);
  console.log(rankBranches(chemTree, 5));

  // const data = { content: content };

  // fetch("http://localhost:4000/counter", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log("Response from server:", data);
  //   })
  //   .catch((error) => {
  //     console.error("Error submitting data:", error);
  //   });
}

// const url = "https://periodicapi.towster.me/";
const url = "http://localhost:4000/";

export async function sendChatRequest(prompt: String): Promise<string> {
  //TODO: Add checks for redundancy

  const data = { prompt: prompt };

  const response = await fetch(`${url}chatbot/`, {
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
