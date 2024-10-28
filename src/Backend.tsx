export function sendContent(ip: String, content: String) {
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

export async function sendChatRequest(prompt: String): Promise<string> {
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
