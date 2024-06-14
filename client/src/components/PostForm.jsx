import React, { useEffect, useState } from "react";
import { recoilSelectedStep, recoilSelectedPosts } from "../recoil/state";
// import { globalJsonData } from "../recoil/state";
import { constSelector, useRecoilState } from "recoil";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import copy from "copy-to-clipboard";
import { urlServer } from "../variables";
import PuffLoader from "react-spinners/PuffLoader";
import SocialMediaShare from "./SocialMediaShare";
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import { createRoot } from "react-dom/client";
import Rights from "./Rights";

export default function PostCreationForm() {
  const [emojis, setEmojis] = useState("yes");
  const [step, setStep] = useRecoilState(recoilSelectedStep);
  // const [maxEmojis, setMaxEmojis] = useState(5);
  // const [minEmojis, setMinEmojis] = useState(1);
  const [wordCount, setWordCount] = useState(100);
  const [paragraphCount, setParagraphCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [handleSubmit, setHandleSubmit] = useState(false);
  const [jsonInstructions, setJsonInstructions] = useState("");
  const [selectedItems, setSelectedItems] = useRecoilState(recoilSelectedPosts);
  const [messageToSend, setMessageToSend] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const { currentUser, error } = useSelector((state) => state.user);
  const [finish, setFinish] = useState(false);
  const [title, setTitle] = useState("");
  const [freeText, setFreeText] = useState("");
  const maxChars = 150;

  const [content, setContent] = useState("");

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setFreeText(text);
    }
  };

  // Function to send message to Gemini
  async function sendMessageToServer() {
    // console.log("API GEMINI");
    try {
      const valueToSend = generateJsonInstructions();
      console.log(valueToSend);
      const response = await fetch(`${urlServer}/api/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: valueToSend }), // Include 'message' property in the request body
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
      console.error("Error sending message to Gemini:", error.message);
      // Handle error if needed
    } finally {
      setLoading(false); // Set loading state to false after the asynchronous operation completes
    }
  }

  // Function to generate JSON instructions
  const generateJsonInstructions = () => {
    // Initial set of instructions
    let instructions = [
      "Hi, I want you to create a post for LinkedIn by following exactly these instructions:",
      "- Include a catchy headline that grabs attention.",
      "- Write a brief introduction to the topic to provide context.",
      `- Keep the post concise at around ${wordCount} words.`,
      `- Include exactly ${paragraphCount} paragraph(s) to organize your content effectively.`,
      emojis === "yes"
        ? `- Use emojis to add visual appeal!`
        : "- Avoid using emojis to maintain a professional tone.",
      "- Incorporate relevant hashtags to increase visibility.",
      "- End with a call to action, such as asking for comments or opinions.",
      `Plese pay carfull attention to this: ${freeText}`,
      "Below is the question and its accepted answer for reference:",
    ];

    // Additional instructions based on selected posts
    const selectedPostsMessage = Object.entries(selectedItems).map(
      ([questionId, item]) => {
        if (item.answers === undefined) return;
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
    return message;
  };

  //When load the page call the generateJsonInstructions function.
  useEffect(() => {
    generateJsonInstructions();
  }, []);

  // function stripHtmlTags(html) {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   return doc.body.textContent || "";
  // }

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
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

  const savePost = (title, content) => {
    setStep("posts");
    fetch(`${urlServer}/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
        author: currentUser._id,
      }),
    }).then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          text: "The Post Saved Successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "The post failed to save successfully.",
          confirmButtonText: "Try again",
          showLoaderOnConfirm: true,
          cancelButtonText: "OK",
          showCancelButton: true,
          preConfirm: async () => {
            try {
              const response = await fetch(`${urlServer}/api/post`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: title,
                  content: content,
                  author: currentUser._id,
                }),
              });

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
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            // Display confirmation modal after saving post
            Swal.fire({
              icon: "success",
              text: "The Post Saved Successfully!",
            });
          }
        });
      }
    });
    setSelectedItems([]);
  };

  const showGeminiResponse = (geminiResponseString) => {
    const [title, content] = getInfo(geminiResponseString);
    let htmlContent = fix(content).replace(/\n/g, '<br>');

    Swal.fire({
      title: title,
      html: htmlContent,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "<i className='las la-copy'></i> Copy to clipboard",
      denyButtonText: "<i className='las la-magic'></i> Generate new Post",
      cancelButtonText: "<i className='las la-save'></i> Save Post",
      footer: '<div id="swal-footer"></div>',
      didOpen: () => {
        const footerElement = document.getElementById("swal-footer");
        if (footerElement) {
          const root = createRoot(footerElement);
          root.render(
            <SocialMediaShare
              text={geminiResponseString}
              title={title}
              content={content}
            />
          );
        }
      },
      showLoaderOnDeny: true,
      showCloseButton: true,
      allowEnterKey: false,
      allowOutsideClick: false, // Set allowOutsideClick to false
      preDeny: async () => {
        await sendMessageToServer();
      },
      preConfirm: () => {
        copy(geminiResponseString);
        return false;
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.close) {
        setSelectedItems([]);
        setFinish(true);
      } else if (result.isConfirmed || result.isDenied) {
        // Handle other button clicks if needed
        return;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        savePost(title, content);
      }
    });
  };

  const getInfo = (geminiResponse1) => {
    console.log("im gminie response:\n\n" + geminiResponse1);
    let i, j;
    let title = "";
    let content = "";

    for (i = 0; i < geminiResponse1.length; i++)
      if (geminiResponse1[i] == "\n") break;

    title = geminiResponse1.substring(0, i);

    // Remove all the '*' from the title
    title = title.replace(/\*/g, "");

    // Remove the Headlines
    if (title.includes("Headline:")) {
      // if doesnt start with 'Headline' only
      if (title.substring(0, 8).toUpperCase() !== "HEADLINE") {
        for (j = 0; j < title.length; j++)
          if (title[j] == ":") {
            j++;
            title = title.substring(j, i);
            break;
          }
      } else title = title.substring(9, i);
    } else if (title.includes("Headline")) title = title.substring(8, i);
    content = geminiResponse1.slice(i);
    setContent(content);
    setTitle(title);
    return [title, content];
  };

  const fix = (content) => {
    // There is a code in the response
    if (content.includes("```")) {
      
      let first = content.indexOf("```");
      let f = content.substring(0, first);
      let str = content.substring(first , content.length);
      console.log("im str first" + str);
      str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      console.log("Fixed string: " + str);
      return f + str;
    }
  };











  return (
    <div>
      {geminiResponse == "" && (
        <div>
          {!handleSubmit && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Instructions for build your post:
              </h2>

              <form
                onSubmit={handleFormSubmit}
                className="max-w-md mx-auto p-4 mt-4 bg-gray-100 shadow-md rounded-md"
              >
                {/* {!handleSubmit && ( */}
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="emojis"
                      className="block font-semibold mb-1"
                    >
                      Do you want emojis?
                    </label>
                    <select
                      id="emojis"
                      value={emojis}
                      onChange={(e) => setEmojis(e.target.value)}
                      className="p-2 border rounded-md w-full"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {/* {emojis === "yes" && (
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
                          onChange={(e) =>
                            setMaxEmojis(parseInt(e.target.value))
                          }
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
                          onChange={(e) =>
                            setMinEmojis(parseInt(e.target.value))
                          }
                          className="p-2 border rounded-md w-full"
                        />
                      </div>
                    </>
                  )} */}
                  {/* <div className="mb-4">
                    <label
                      htmlFor="wordCount"
                      className="block font-semibold mb-1"
                    >
                      Desired word count:
                    </label>
                    <input
                      type="number"
                      id="wordCount"
                      value={wordCount}
                      onChange={(e) => setWordCount(parseInt(e.target.value))}
                      className="p-2 border rounded-md w-full"
                    />
                  </div> */}

                  <label
                    htmlFor="wordCount"
                    className="block mb-2  font-semibold    text-gray-900 dark:text-white"
                  >
                    Desired word count:
                  </label>
                  <input
                    type="number"
                    id="wordCount"
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value))}
                    required
                  />
                  <div className="my-4">
                    <label
                      htmlFor="paragraphCount"
                      className="block mb-2 font-semibold  text-gray-900 dark:text-white"
                    >
                      Desired paragraph count:
                    </label>
                    <input
                      type="number"
                      id="paragraphCount"
                      aria-describedby="helper-text-explanation"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={paragraphCount}
                      onChange={(e) =>
                        setParagraphCount(parseInt(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="freeText"
                      className="block mb-2  font-semibold  text-gray-900 dark:text-white"
                    >
                      Your message:
                    </label>
                    <textarea
                      id="freeText"
                      type="text"
                      value={freeText}
                      onChange={handleInputChange}
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your additional rules here..."
                    ></textarea>
                    <div className="text-right text-sm text-gray-500">
                      {maxChars - freeText.length} characters remaining
                    </div>
                  </div>
                </div>
                {/* )}  */}

                <div className="flex justify-center w-full ">
                  <button
                    type="submit"
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    disabled={loading || loading}
                  >
                    Create My Post
                  </button>
                </div>
              </form>

              <div className="flex justify-center w-full ">
                <button
                  type="button"
                  onClick={moveToSelectedPostsPage}
                  className="mt-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                >
                  Previous Step
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div>
              <PuffLoader color="#36d7b7" loading />
            </div>
          )}
        </div>
      )}

      {geminiResponse != "" && finish && (
        <Rights
          geminiResponse={geminiResponse}
          title={title}
          content={content}
        />
      )}
    </div>
  );
}
