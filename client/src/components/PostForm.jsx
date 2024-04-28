import React, { useEffect, useState } from "react";
import { recoilSelectedStep, recoilSelectedPosts } from "../recoil/state";
import { globalJsonData } from "../recoil/state";
import { useRecoilState } from "recoil";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from 'sweetalert2'
import swal from 'sweetalert';
import copy from "copy-to-clipboard";






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
  const [geminiResponse, setGeminiResponse] = useState("");
  const { currentUser, error } = useSelector((state) => state.user);
  let postFlag = 0;


  // Function to send message to Gemini
  async function sendMessageToServer() {
    console.log("API GEMINI");
    // console.log("messageToSend", messageToSend);
    try {
      setLoading(true); // Set loading state to true before the asynchronous operation starts

      generateJsonInstructions(); // Call generateJsonInstructions and wait for it to complete

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }), // Include 'message' property in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to send message to Gemini");
      }

      const data = await response.json();
      const geminiResponseString = `${data.message}`;
      setGeminiResponse(geminiResponseString);
      // Handle response from Gemini if needed
      showGeminiResponse(geminiResponseString);

     
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      // Handle error if needed
    } finally {
      
      setLoading(false); // Set loading state to false after the asynchronous operation completes
    }
  }

  // Function to generate JSON instructions
  const generateJsonInstructions = () => {
    // Initial set of instructions
    let instructions = [
      "Hi, I want you to create a post for LinkedIn by following these instructions:",
      "- Include a catchy headline that grabs attention.",
      "- Write a brief introduction to the topic to provide context.",
      `- Use ${wordCount} words in your post to ensure it's concise and engaging.`,
      `- Include ${paragraphCount} paragraph(s) to organize your content effectively.`,
      emojis === "yes"
        ? `- Use emojis to add visual appeal. (Maximum: ${maxEmojis}, Minimum: ${minEmojis}).`
        : "- Avoid using emojis to maintain a professional tone.",
      "- Incorporate relevant hashtags to increase visibility.",
      "- End with a call to action, such as asking for comments or opinions.",
      "Below is the question and its accepted answer for reference:",
    ];

    // Additional instructions based on selected posts
    const selectedPostsMessage = Object.entries(selectedItems).map(
      ([questionId, item]) => {
        const acceptedAnswers = item.answers.filter(
          (answer) => answer.is_accepted
        );
        let message = `\nQuestion ID: ${questionId}\n\nQuestion Body: ${item.body}\n\n`;

        if (acceptedAnswers.length > 0) {
          message += "Accepted Answers:\n";
          message += acceptedAnswers
            .map((acceptedAnswer, index) => {
              return `Answer ${index + 1}:\n${acceptedAnswer.body}\n\n`;
            })
            .join("");
        } else {
          message += "No accepted answers found.\n\n";
        }

        return message;
      }
    );

    // Combine initial instructions and selected posts message
    instructions = instructions.concat(selectedPostsMessage);

    // Set the JSON instructions state
    setJsonInstructions(instructions.join("\n"));

    // Construct the message to send
    const message = `${instructions.join("\n")}`;
    setMessageToSend(message);
  };

  //When load the page call the generateJsonInstructions function.
  useEffect(() => {
    generateJsonInstructions();
  }, []);

  // function GeminiResponse({ response }) {
  //   return (
  //     <div className="gemini-response">
  //       <p>{response}</p>
  //       <style jsx>{`
  //         .gemini-response {
  //           background-color: #f0f0f0;
  //           padding: 20px;
  //           border-radius: 5px;
  //           margin-top: 20px;
  //         }
  //         .gemini-response p {
  //           font-size: 16px;
  //           line-height: 1.5;
  //           margin: 0;
  //         }
  //       `}</style>
  //     </div>
  //   );
  // }

  // //////////////////////////////////////////////////////////////////////////
  function stripHtmlTags(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }




  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setHandleSubmit(true);
    try {
      await generateJsonInstructions(); // Generate JSON instructions
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
      await sendMessageToServer(); // Send message to Gemini
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setHandleSubmit(false);
    }
  };


  const moveToSelectedPostsPage = () => {
    setStep("selectedPosts");
  };




  const savePost = (title, content, ) => {
    fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
        author: currentUser._id
      }),
    })
    .then(response => {
      if (response.status === 200) {
        swal({
          icon: "success",
          text: "The Post Saved Successfully!"
        });
    }

    else{
      Swal.fire({
        icon: "error",
        text: "The post failed to save successfully.",
        confirmButtonText: "Try again",
        showLoaderOnConfirm: true,
        cancelButtonText: "OK",
        showCancelButton: true,

        preConfirm: async () => {
          try {
            const response = await fetch('/api/post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title,
                content: content,
                author: currentUser._id
              }),
            })

            if (!response.ok) {
              return Swal.showValidationMessage(`
                Error saving the post
              `);
            }
            return response.json();
          } catch (error) {
            Swal.showValidationMessage(`
              Request failed: ${error}
            `);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
              icon: "success",
              text: "The Post Saved Successfully!"
          });}
      });
    }
  })}


const showGeminiResponse = (geminiResponseString) => {
  const [title, content] = getInfo(geminiResponseString);
  const htmlContent = content.replace(/\n/g, '<br>');

    Swal.fire({
      title: title,
      html: htmlContent,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Copy to clipboard",
      denyButtonText: "Generate new Post",
      cancelButtonText: "Save Post",
      showLoaderOnDeny: true,
      showCloseButton: true,
      allowEnterKey: false,
      allowOutsideClick: false,

      preDeny: async () => {
          await sendMessageToServer();
      },
      preConfirm: () => {
        copy(geminiResponseString);
        return false;}
    })
    .then((result) => {
      if(result.isConfirmed || result.isDenied || result["dismiss"] === "close") 
        return;
      else{// dismiss: cancel
        savePost(title, content);
      }
    });
}



const getInfo = (geminiResponse) => {
    let i;
    let title = "";
    let content = "";

    for(i = 0; i < geminiResponse.length; i++) 
      if(geminiResponse[i] == '\n')
        break;

    title = geminiResponse.substring(0, i);

    // Remove all the '*' from the title
    title = title.replace(/\*/g,"");

    // Remove the Headlines
    if(title.includes("Headline:"))
      title = title.substring(9, i)
    else if(title.includes("Headline"))
      title = title.substring(8, i)
    content = geminiResponse.slice(i);
    return [title, content];
}








  return (
    <div>
    {geminiResponse == "" && (
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
              <div className="mb-4">
                <label
                  // htmlFor="paragraphCount"
                  className="block font-semibold mb-1"
                >
                  Free text you want to display:
                </label>
                <input
                  type="text"
                  // id="paragraphCount"
                  // value={paragraphCount}
                  // onChange={(e) => setParagraphCount(parseInt(e.target.value))}
                  // className="p-2 border rounded-md w-full"
                />
              </div>
            </div>
          )}

          {/* {isChatGPTTyping && (
            <div className="typing-indicator">is typing...</div>
          )} */}



          <button
            type="submit"
            className={`px-4 py-2 rounded-md hover:bg-blue-600 ${
              handleSubmit || loading // Disable the button if handleSubmit or loading is true
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-blue-600"
            }`}
            onClick={sendMessageToServer}
            disabled={handleSubmit || loading} // Disable the button if handleSubmit or loading is true
          >
            Create My Post
          </button>
        </form>
      </div>

      /* <button
        className={`px-4 py-2 m-2 rounded-md hover:bg-green-600 ${
          handleSubmit || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-blue-600"
        }`}
        onClick={sendMessageToServer}
        disabled={handleSubmit || loading}
      >
        Send To Gemini
      // </button> */


    
    )
    }
      {/* <div className="gemini-response"> */}


      {/* {
      geminiResponse != "" && (
      <div className="gemini-response">
        {showGeminiResponse()}
        {/* {console.log("Gemini Response\n\n")} */}
       
      {/* </div> */}
    {/* // ) */}
    {/* // }  */}



        
        {/* <pre className="gemini-response-text">{geminiResponse}</pre>
        <style>{`
          .gemini-response {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .gemini-response-text {
            font-size: 16px;
            line-height: 1.5;
            margin: 0;
            white-space: pre-wrap; /* Preserve white space and allow wrapping */
            // word-wrap: break-word; /* Break long words to prevent overflow */
          // }
        // `
        // }
        // </style> */}


      // </div>

      // {loading && handleSubmit && <p>Loading...</p>}

      <button
        onClick={moveToSelectedPostsPage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Move back
      </button>
}


    {/* {
    geminiResponse != "" && (
      <button
        onClick={savePost}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save this post
      </button>
    )
    } */}

    </div>
  );
}
