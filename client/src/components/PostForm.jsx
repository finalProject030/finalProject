import React, { useState } from "react";

export default function PostCreationForm() {
  const [emojis, setEmojis] = useState("yes");
  const [maxEmojis, setMaxEmojis] = useState(5);
  const [minEmojis, setMinEmojis] = useState(1);
  const [wordCount, setWordCount] = useState(100);
  const [paragraphCount, setParagraphCount] = useState(1);
  const [summary, setSummary] = useState(
    "The Daily Discussion is a weekly feature on CNN.com's iReport.com.com. Please share your photos and stories you saw on CNN iReport. Click here for more stories. Visit CNN. com.com/daily discussion of stories you see on CNN's iReporter's weekly Newsquiz.com, or visit CNN.uk.com or visit iReport in a new story.com for a new article..com: Share your photos... Click here"
  );
  const [loading, setLoading] = useState(false);
  const [handleSubmit, setHandleSubmit] = useState(false);
  const [jsonInstructions, setJsonInstructions] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const transformText = async () => {
    setLoading(true);
    try {
      console.log(jsonInstructions);
      const res = await fetch("/api/transformText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article: summary,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setSummary(data[0].summary_text);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const handleFormSubmit = (event) => {
  //     event.preventDefault();
  //     setHandleSubmit(true);
  //     // generateJsonInstructions();
  //     // await transformText();
  //     handleSend();
  //     if (!loading) {
  //       setHandleSubmit(false);
  //     }
  //   };

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
      `Here is what you should summary base on my rules above: ${summary}`, // Append the summary value to the instructions
    ];
    setJsonInstructions(instructions.join("\n"));
  };

  const handleSend = async () => {
    generateJsonInstructions();

    console.log("jsonInstructions:", jsonInstructions);

    try {
      setLoading(true); // Set loading state to true before making the API call

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: jsonInstructions }), // Correct JSON payload format
      });

      if (!response.ok) {
        throw new Error("Failed to send message to the server");
      }

      const data = await response.json();
      setChatResponse(data.message); // Update chatResponse state

      // Log chatResponse outside of the setChatResponse callback
      //   console.log(data.message);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, handle errors here (e.g., display an error message to the user)
    } finally {
      setLoading(false); // Set loading state back to false once the response is received
      setHandleSubmit(false); // Reset the handleSubmit state
    }
  };

  console.log(chatResponse);
  return (
    <div>
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
        <button
          type="submit"
          className={`px-4 py-2 rounded-md hover:bg-blue-600 ${
            handleSubmit || loading // Disable the button if handleSubmit or loading is true
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={handleSubmit || loading} // Disable the button if handleSubmit or loading is true
        >
          Create Post
        </button>
      </form>
      {loading && handleSubmit && <p>Loading...</p>}
      {chatResponse && (
        <div className="mt-4">
          <p>chatResponse: {chatResponse}</p>
        </div>
      )}
    </div>
  );
}
