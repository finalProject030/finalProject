import React, { useState } from "react";
import { recoilSelectedStep, recoilSelectedPosts } from "../recoil/state";
import { useRecoilState } from "recoil";

export default function PostCreationForm() {
  const [emojis, setEmojis] = useState("yes");
  const [step, setStep] = useRecoilState(recoilSelectedStep);
  const [maxEmojis, setMaxEmojis] = useState(5);
  const [minEmojis, setMinEmojis] = useState(1);
  const [wordCount, setWordCount] = useState(100);
  const [paragraphCount, setParagraphCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [handleSubmit, setHandleSubmit] = useState(false);
  const [jsonInstructions, setJsonInstructions] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [selectedItems, setSelectedItems] = useRecoilState(recoilSelectedPosts);
  const [messageToSend, setMessageToSend] = useState("");
  const [isChatGPTTyping, setIsChatGPTTyping] = useState(false);

  // //////////////////////////////////////////////////////////////////////////Gemini
  async function sendMessageToServer(messageToSend) {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.message; // Assuming your server returns the processed message
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }

  // //////////////////////////////////////////////////////////////////////////

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setHandleSubmit(true);
    try {
      handleSend();
    } finally {
      setHandleSubmit(false); // Reset handleSubmit state when submission is completed
      setChatResponse(""); // Clear chatResponse state
    }
  };

  const generateJsonInstructions = () => {
    const instructions = [
      "Start your post with a catchy headline.",
      "Include a brief introduction to the topic.",
      `Use ${wordCount} words in your post.`,
      `Include ${paragraphCount} paragraph(s) in your post.`,
      emojis === "yes"
        ? `Use emojis - Maximum: ${maxEmojis}, Minimum: ${minEmojis}.`
        : "Avoid using emojis in your post.",
      "Incorporate relevant hashtags.",
      "End with a call to action, such as asking for comments or opinions.",
      "Proofread your post for grammar and spelling errors.",
      `Here is what you should summary base on my rules above: ${messageToSend}`, // Append the summary value to the instructions
    ];
    setJsonInstructions(instructions.join("\n"));
  };

  const handleSend = async () => {
    generateJsonInstructions(); // Generate JSON instructions

    const selectedPostsMessage = Object.entries(selectedItems).map(
      ([questionId, item]) => {
        return `Question ID: ${questionId}\n\nQuestion Body: ${
          item.body
        }\n\nAccepted Answers:\n${item.answers
          .filter((answer) => answer.is_accepted)
          .map((acceptedAnswer, index) => {
            return `Answer ${index + 1}:\n${acceptedAnswer.body}\n\n`;
          })
          .join("")}`;
      }
    );

    const message = `${jsonInstructions}\n\nSelected Posts:\n${selectedPostsMessage.join(
      "\n\n"
    )}`;
    setMessageToSend(message);

    const article = message;

    // console.log("Message to be sent:", message); // Log the message to the console

    try {
      setLoading(true);

      const response = await fetch("/api/transformText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article: message }), // Send the text to the server
      });

      if (!response.ok) {
        throw new Error("Failed to send message to the server");
      }

      const data = await response.text(); // Receive text data from the server
      // console.log("Text received:", data); // Log the received text
      setChatResponse(data); // Set the received text as chatResponse
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setHandleSubmit(false);
    }
  };

  const moveToSelectedPostsPage = () => {
    setStep("selectedPosts");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Instructions for build your post:
      </h2>

      <form
        onSubmit={handleFormSubmit}
        className="max-w-md mx-auto p-4 mt-4 bg-gray-100 shadow-md rounded-md"
      >
        {!handleSubmit && (
          <div>
            <div className="mb-4">
              <label htmlFor="emojis" className="block font-semibold mb-1">
                Do you want emojis?
              </label>
              <select
                id="emojis"
                value={emojis}
                onChange={(e) => setEmojis(e.target.value)}
                className="p-2 border rounded-md w-full"
              >
                <option value="yes">Yes, a lot</option>
                <option value="few">Yes, but a few</option>
                <option value="no">No</option>
              </select>
            </div>
            {emojis === "yes" && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="maxEmojis"
                    className="block font-semibold mb-1"
                  >
                    Maximum number of emojis:
                  </label>
                  <input
                    type="number"
                    id="maxEmojis"
                    value={maxEmojis}
                    onChange={(e) => setMaxEmojis(parseInt(e.target.value))}
                    className="p-2 border rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="minEmojis"
                    className="block font-semibold mb-1"
                  >
                    Minimum number of emojis:
                  </label>
                  <input
                    type="number"
                    id="minEmojis"
                    value={minEmojis}
                    onChange={(e) => setMinEmojis(parseInt(e.target.value))}
                    className="p-2 border rounded-md w-full"
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label htmlFor="wordCount" className="block font-semibold mb-1">
                Desired word count:
              </label>
              <input
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="paragraphCount"
                className="block font-semibold mb-1"
              >
                Desired paragraph count:
              </label>
              <input
                type="number"
                id="paragraphCount"
                value={paragraphCount}
                onChange={(e) => setParagraphCount(parseInt(e.target.value))}
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>
        )}

        {isChatGPTTyping && (
          <div className="typing-indicator">is typing...</div>
        )}
        <button
          type="submit"
          className={`px-4 py-2 rounded-md hover:bg-blue-600 ${
            handleSubmit || loading // Disable the button if handleSubmit or loading is true
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={handleSubmit || loading} // Disable the button if handleSubmit or loading is true
        >
          Create Post Summary
        </button>
      </form>

      <button
        className={`px-4 py-2 m-2 rounded-md hover:bg-green-600 ${
          handleSubmit || loading // Disable the button if handleSubmit or loading is true
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-blue-600"
        }`}
        onClick={() => sendMessageToServer(messageToSend)}
        disabled={handleSubmit || loading} // Disable the button if handleSubmit or loading is true
      >
        Send To OpenAI
      </button>
      {messageToSend}
      {loading && handleSubmit && <p>Loading...</p>}

      <button
        onClick={moveToSelectedPostsPage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Move back
      </button>
    </div>
  );
}
