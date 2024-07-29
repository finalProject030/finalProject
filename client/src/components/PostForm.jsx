import React, { useEffect, useState } from "react";
import { recoilSelectedStep, recoilSelectedPosts } from "../recoil/state";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Input, inputClasses } from '@mui/base/Input';
// import { globalJsonData } from "../recoil/state";
import { constSelector, useRecoilState } from "recoil";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import copy from "copy-to-clipboard";
import { scrollToTop, urlServer } from "../variables";
import PuffLoader from "react-spinners/PuffLoader";
import SocialMediaShare from "./SocialMediaShare";
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import { createRoot } from "react-dom/client";
import Rights from "./Rights";
import DoneAllIcon from '@mui/icons-material/DoneAll';

let summary = "";

export default function PostCreationForm() {
  const [emojis, setEmojis] = useState("yes");
  const [step, setStep] = useRecoilState(recoilSelectedStep);
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

  // Function send message to Gemini
  async function sendMessageToServer() {
    if (summary == "") summary = await summerizeQuestionAnswer();
    try {
      const valueToSend = generateJsonInstructions(summary);
      // console.log("value to send:\n\n");
      // console.log(valueToSend);
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

  // Function to summerize each question and answer
  const summerizeQuestionAnswer = async () => {
    const selectedPostsMessage = Object.entries(selectedItems).map(
      ([questionId, item]) => {
        if (item.answers === undefined) return;
        const acceptedAnswers = item.answers.filter(
          (answer) => answer.is_accepted
        );
        let message = `Hi i want you to summarize this:\nQuestion ID: ${questionId}\n\nQuestion Body: ${item.body}\n\n`;
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

    const sum = [];
    let i = 1;

    for (const selectedPost of selectedPostsMessage) {
      if (selectedPost) {
        try {
          const response = await fetch(`${urlServer}/api/gemini`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: selectedPost }),
          });

          if (!response.ok) {
            throw new Error("Failed to send message to Gemini");
          }

          const data = await response.json();
          const geminiResponseString = `${data.message}`;
          sum.push(`Post Number ${i}:\n${geminiResponseString}`);
          i++;
        } catch (error) {
          console.error(error);
        }
      }
    }

    return sum;
  };

  // Function to generate JSON instructions
  const generateJsonInstructions = (summary) => {
    if (summary == undefined) return "";

    // Initial set of instructions
    const instructions = [
      "Hi, I want you to create a post for LinkedIn by following exactly these instructions:\n",
      summary.length > 1 
      ? `- Notice that you have couple of posts and you should create only one post\n`+
        `- Ignore the posts numbers, they are not relevant.\n`+
        `- Make one post only from the posts\n`
      : `- Notice that you have one post and you should create only one post\n`,
      "- Include a catchy headline that grabs attention.\n",
      "- Write a brief introduction to the topic to provide context.\n",
      `- Keep the post concise at around ${wordCount} words.\n`,
      `- divide the text into ${paragraphCount} paragraphs.\n`,
      // `- Include exactly ${paragraphCount} paragraph(s) to organize your content effectively.`,
      emojis === "yes"
        ? `- Use emojis to add visual appeal!\n`
        : "- Avoid using emojis to maintain a professional tone.\n",
      "- Incorporate relevant hashtags to increase visibility.\n",
      "- End with a call to action, such as asking for comments or opinions.\n",
      `Plese pay carfull attention to this: ${freeText}\n`,
      "Below is the information that you will use to create the post:\n",
    ];
  
    // Set the JSON instructions state
    setJsonInstructions(instructions);
    // Construct the message to send
    const message = `${instructions}\n${summary}`;
    console.log(message);
    setMessageToSend(message);
    return message;
  };

  //When load the page call the generateJsonInstructions function.
  useEffect(() => {
    generateJsonInstructions();
    scrollToTop();
  }, []);


  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setHandleSubmit(true);
    try {
      await sendMessageToServer(); // Send message to Gemini
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setHandleSubmit(false);
    }
  };

  const moveToSelectedPostsPage = () => {
    setStep("selectedPosts");
    summary = "";
  };

  const savePost = (title, content) => {
    // setStep("posts");
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
            Swal.fire({
              icon: "success",
              text: "The Post Saved Successfully!",
            });
          }
        });
      }
    });
    setSelectedItems([]);
    setFinish(true);
  };

  const showGeminiResponse = (geminiResponseString) => {
    const [title, content] = getInfo(geminiResponseString);
    let htmlContent = fix(content).replace(/\n/g, "<br>");

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
        summary = "";
        setSelectedItems([]);
        setFinish(true);
      } else if (result.isConfirmed || result.isDenied) {
        return;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        savePost(title, content);
        summary = "";
      }
    });
  };

  const getInfo = (geminiResponse1) => {
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
      let str = content.substring(first, content.length);
      // console.log("im str first" + str);
      str = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // console.log("Fixed string: " + str);
      return f + str;
    }
    return content;
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

              {/* <form
                onSubmit={handleFormSubmit}
                className="max-w-md mx-auto p-4 mt-4 bg-gray-100 shadow-md rounded-md"
              >
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
                      className="p-2 border rounded-md w-full dark:bg-gray-700 dark:text-white"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <label
                    htmlFor="wordCount"
                    className="block mb-2  font-semibold    text-gray-900 dark:text-black"
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
                      className="block mb-2 font-semibold  text-gray-900 dark:text-black"
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
                      className="block mb-2  font-semibold  text-gray-900 dark:text-black"
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

                <div className="flex justify-center w-full ">
                  <button
                    type="submit"
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    disabled={loading || loading}
                  >
                    Create My Post
                  </button>
                </div>
              </form> */}

              <Box
              onSubmit={handleFormSubmit}            
              component="form"
              sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              width: 400,
              margin: "auto",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: "background.paper",
            }}
          >
            <FormControl fullWidth={true} >
            <InputLabel id="demo-simple-select-label">Do you want emojis?</InputLabel>
            <Select
              value={emojis}
              sx={{ mb: 5 }}
              onChange={(e) => setEmojis(e.target.value)}
              labelid="demo-simple-select-label"
              id="demo-simple-select"
              required
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>

            <TextField
              type="number"
              sx={{ mb: 5 }}
              id="wordCount"
              label="Desired word count"
              variant="outlined"
              fullWidth
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              inputProps={{
                min: 20, // Ensure the minimum value is 20
              }}
              required
              >
              </TextField>

              <TextField
              type="number"
              sx={{ mb: 5 }}
              id="paragraphCount"
              label="Desired paragraph count"
              variant="outlined"
              fullWidth
              value={paragraphCount}
              onChange={(e) => setParagraphCount(parseInt(e.target.value))}
              inputProps={{
                min: 1, // Ensure the minimum value is 1
              }}
              required
              >
              </TextField>

              
              <TextField
                id="outlined-multiline-flexible"
                label="Free Text"
                placeholder="Write your additional rules here..."
                value={freeText}
                onChange={handleInputChange}
                multiline
                maxRows={4}
              />
              <div className="text-right text-sm text-gray-500" >
                {maxChars - freeText.length} characters remaining
              </div>
              <Button 
                variant="contained" 
                color="success"
                type="submit" 
                sx={{ mt: 5, mb: 1.5 }}
                disabled={loading || loading}>
                Create My Post
                <DoneAllIcon/>
              </Button> 
              
            </FormControl>
          </Box>

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
