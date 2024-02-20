import React, { useState } from "react";

const LinkedInPostForm = ({ selectedPost }) => {
  const [emojis, setEmojis] = useState(0);
  const [paragraphs, setParagraphs] = useState(1);
  const [isEasyEnglish, setIsEasyEnglish] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      selectedPost,
      emojis,
      paragraphs,
      isEasyEnglish,
      additionalInfo,
    };
    const postDataString = formatPostData(postData);
    sendToChatbot(postDataString);
  };

  const formatPostData = (data) => {
    return `
    Selected Post: ${data.selectedPost}
    Emojis: ${data.emojis}
    Paragraphs: ${data.paragraphs}
    Language: ${data.isEasyEnglish ? "Easy English" : "Standard English"}
    Additional Info: ${data.additionalInfo}
    `;
  };

  const sendToChatbot = (postDataString) => {
    // Assuming you have a function to send data to Chatbot
    // Replace this with your actual implementation
    console.log("Sending data to Chatbot:", postDataString);
  };

  return (
    <div>
      <h2>Create Professional LinkedIn Post</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Emojis:
          <input
            type="number"
            value={emojis}
            onChange={(e) => setEmojis(e.target.value)}
          />
        </label>
        <br />
        <label>
          Paragraphs:
          <input
            type="number"
            value={paragraphs}
            onChange={(e) => setParagraphs(e.target.value)}
          />
        </label>
        <br />
        <label>
          Easy English:
          <input
            type="checkbox"
            checked={isEasyEnglish}
            onChange={(e) => setIsEasyEnglish(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Additional Info:
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </label>
        <br />
        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Generate LinkedIn Post
        </button>
      </form>
    </div>
  );
};

export default LinkedInPostForm;
