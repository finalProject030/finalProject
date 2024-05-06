import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Select from "react-select";
import { LuFilter } from "react-icons/lu";
import { useRecoilState } from "recoil";
import { recoilSelectedPosts, recoilSelectedStep } from "../recoil/state";
import SelectedPosts from "../components/SelectedPosts";
import Toolbar from "../components/Toolbar";
import axios from 'axios';
import Swal from 'sweetalert2'




const HTMLCodeDisplay = ({ htmlCode }) => {
  return (
    <pre
      dangerouslySetInnerHTML={{ __html: htmlCode }}
      className="max-w-full overflow-x-auto"
    />
  );
};




const Posts = () => {
  const [tagged, setTagged] = useState(""); // Default tag
  const [questions, setQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [addNumber, setaddNumber] = useState(1);
  const [search, setSearch] = useState(false);
  const [checkedItems, setCheckedItems] = useRecoilState(recoilSelectedPosts);
  const [step, setStep] = useRecoilState(recoilSelectedStep);
  const [showTheNextStep, setShowTheNextStep] = useState(false);
  const [questionsData, setQuestionsData] = useState("");
  const [pageNumber, setPageNumber] = useState(1);


  const handleToggleComponent = () => {
    setShowTheNextStep(true);
    setStep("selectedPosts");
  };
  // const [checkedItems, setCheckedItems] = useState({});

  const [sort, setSort] = useState("votes");
  const [order, setOrder] = useState("desc");

  const filterQuestionsList = [
    { value: "votes", label: "Votes (deafult)" },
    { value: "activity", label: "Activity" },
    { value: "creation", label: "Creation date" },
    { value: "relevance", label: "Relevance" },
  ];

  const orderQuestionsList = [
    { value: "desc", label: "Desc (deafult)" },
    { value: "asc", label: "Asc" },
  ];
  const dateQuestions = [
    { value: "desc", label: "From date" },
    { value: "asc", label: "To date" },
  ];

  const fetchQuestions = () => {
    setaddNumber(addNumber + 1);

    // there is no input field
    if (tagged != "") {
      if (
        addNumber == 10 &&
        questionsData != undefined &&
        questionsData.has_more
      ) {
        let n = pageNumber + 1;
        setPageNumber(n);
        console.log(pageNumber);
        setaddNumber(1);
        return;
      }

      //26 dont give
      if (pageNumber >= 26) {
        Swal.fire({
          title: "You reach the limit of the content.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm"
        });
        return;
      }

      if (questionsData === "") {
        try {
          let api = "";
          console.log("API called");
          if (sort !== "relevance")
            api = `https://api.stackexchange.com/2.3/search/advanced?page=${pageNumber}&pagesize=100&order=${order}&sort=${sort}&q=${tagged}&site=stackoverflow&filter=!6WPIomnMOOD*e`;
          else
            api = `https://api.stackexchange.com/2.3/search/advanced?page=${pageNumber}&pagesize=100&order=desc&sort=votes&q=${tagged}&site=stackoverflow&filter=!nNPvSNPI7A`;
          // filter=!nNPvSNPI3D

          axios.get(api)
          .then((response) => {
            setQuestionsData(response.data);
            if (questionsData.items) {
              // Show 10 questions
              const randomQuestions = data.items.slice(
                (addNumber - 1) * 10,
                addNumber * 10
              );

              fetchAnswers(randomQuestions);

              if (questions.length === 0) {
                setQuestions(randomQuestions);
              } else questions.push(...randomQuestions);
            }
          });


        } catch (error) {
          console.error("Error fetching data:", error);
        }

      } else {
        console.log(addNumber + "ds");
        if (questionsData.items) {
          // Show 10 questions
          const randomQuestions = questionsData.items.slice(
            (addNumber - 1) * 10,
            addNumber * 10
          );
          fetchAnswers(randomQuestions);
          if (questions.length === 0) {
            setQuestions(randomQuestions);
          } else questions.push(...randomQuestions);
        }
      }
    }
  };

  const fetchAnswers = async (questions) => {
    if (questions.length > 0) {
      try {
        let api = "";
        const answersPromises = questions.map(async (question) => {
          console.log("API answers");
          if (sort !== "relevance")
            api = `https://api.stackexchange.com/2.3/questions/${question.question_id}/answers?order=${order}&sort=${sort}&site=stackoverflow&filter=!6WPIomnMOOD*e`;
          else
            api = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&title=react&site=stackoverflow&filter=!6WPIomnMOOD*e`;
          let data;
          await axios.get(api)
          .then((response) => {
            data = response.data.items;
          });
          return { questionId: question.question_id, answers: data };
        });
        const answersData = await Promise.all(answersPromises);
        const answersMap = {};
        answersData.forEach(({ questionId, answers }) => {
          answersMap[questionId] = answers;
        });
        setAnswers(answersMap);
      } catch (error) {
        console.error("Error fetching answers data:", error);
      }
    }
  };


  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };


  const toggleAnswers = (questionId) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };


  const handleTagChange = (e) => {
    setTagged(e.target.value);
  };


  const handleFormSubmit = (e) => {
    setQuestions([]);
    setExpandedQuestions({});
    setAnswers({});
    setExpandedAnswers({});
    setSelectedItems({});
    setSearch(true);
    e.preventDefault();
    setaddNumber(1);
  };


  const handleChange = (questionId) => {
    console.log(checkedItems);
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };

      if (updatedItems[questionId] !== undefined) {
        // If the item is already selected, remove it
        delete updatedItems[questionId];
      } else {
        // If the item is not selected and there are less than 4 selected items, add it
        if (Object.keys(updatedItems).length < 4) {
          // Add an object with questionId, question body, answers, and other necessary data
          updatedItems[questionId] = {
            questionId: questionId,
            body: questions.find((q) => q.question_id === questionId).body, // Get question body
            answers: answers[questionId], // Get answers
            // Include any other necessary data here
          };
        } else {
          Swal.fire({
            title: "You can only select up to 4 items.",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Confirm"
          });
          return updatedItems; // Exit early if max limit reached
        }
      }
      return updatedItems;
    });
  };


  useEffect(() => {
    // This block will run after the component has rendered and whenever checkedItems has been updated
    setSelectedItems(checkedItems);
  }, [checkedItems]);


  useEffect(() => {
    // This block will run whenever selectedItems has been updated
  }, [selectedItems]);


  useEffect(() => {
    fetchQuestions();
  }, [questionsData]);


  useEffect(() => {
    // pageNumber++;
  }, [pageNumber]);


  useEffect(() => {
    if (addNumber === 1) {
      if (questionsData != "") setQuestionsData("");
      else fetchQuestions();
    }
  }, [addNumber]);




  return (
    <div className="flex">
      {" "}
      {/* Set the height of the parent container */}
      <Toolbar currentStep={step} />
      {step === "posts" ? (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">
            Stack Overflow Questions Tagged with {tagged}
          </h1>
          <form className="mb-4" onSubmit={handleFormSubmit}>
            <label className="mr-2">
              Enter Subject:
              <input
                type="text"
                value={tagged}
                onChange={handleTagChange}
                className="border p-2"
              />
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2">
              Search
            </button>
            {Object.keys(checkedItems).length > 0 && (
              <button
                type="button"
                className="bg-blue-500 text-white p-2 m-5"
                onClick={handleToggleComponent}
              >
                Move to the next step
              </button>
            )}
            <div>
              <h1>
                {" "}
                Filters <LuFilter />{" "}
              </h1>
              <Select
                defaultValue={filterQuestionsList[0]}
                options={filterQuestionsList}
                onChange={(e) => setSort(e.value)}
              />
              <Select
                defaultValue={orderQuestionsList[0]}
                options={orderQuestionsList}
                onChange={(e) => setOrder(e.value)}
              />
            </div>
          </form>
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question) => (
              <div
                key={question.question_id}
                className="bg-white p-4 border rounded-md shadow-md"
              >
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-bold text-lg mb-2 block"
                >
                  <HTMLCodeDisplay htmlCode={question.title} />
                </a>

                <button
                  onClick={() => toggleQuestion(question.question_id)}
                  className="text-blue-500 hover:underline mb-2 block"
                >
                  {expandedQuestions[question.question_id]
                    ? "Close the Question"
                    : "Show me the full Question"}
                </button>
                {expandedQuestions[question.question_id] && (
                  <HTMLCodeDisplay htmlCode={question.body} />
                )}
                <button
                  onClick={() => toggleAnswers(question.question_id)}
                  className="text-blue-500 hover:underline mb-2 block"
                >
                  {expandedAnswers[question.question_id]
                    ? "Close the Answers"
                    : "Show me The Answers"}
                </button>
                {expandedAnswers[question.question_id] &&
                  answers[question.question_id] &&
                  answers[question.question_id].map((answer) => (
                    <HTMLCodeDisplay
                      key={answer.answer_id}
                      htmlCode={answer.body}
                    />
                  ))}
                <Checkbox
                  checked={Boolean(checkedItems[question.question_id])}
                  onChange={() => handleChange(question.question_id)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </div>
            ))}
          </div>

          {search && questions.length >= 10 && (
            <div className="nextPageLink">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => {
                  fetchQuestions();
                }}
              >
                Show 10 more results
              </button>
            </div>
          )}
        </div>
      ) : (
        <SelectedPosts />
      )}
    </div>
  );
};

export default Posts;
