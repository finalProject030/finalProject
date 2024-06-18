import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Select from "react-select";
import { LuFilter } from "react-icons/lu";
import { useRecoilState } from "recoil";
import { recoilSelectedPosts, recoilSelectedStep } from "../recoil/state";
import SelectedPosts from "../components/SelectedPosts";
import Toolbar from "../components/Toolbar";
import axios from "axios";
import Swal from "sweetalert2";
import { BsSearch } from "react-icons/bs";

const HTMLCodeDisplay = ({ htmlCode }) => {
  return (
    <pre
      dangerouslySetInnerHTML={{ __html: htmlCode }}
      className="max-w-full overflow-x-auto"/>);};

// Global variable for the question id
let uniqueQuestionsId = [];
let search1 = false;


const Posts = () => {
  const [tagged, setTagged] = useState(""); // Default tag
  const [questions, setQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [addNumber, setaddNumber] = useState(0);
  const [search, setSearch] = useState(false);
  const [checkedItems, setCheckedItems] = useRecoilState(recoilSelectedPosts);
  const [step, setStep] = useRecoilState(recoilSelectedStep);
  const [showTheNextStep, setShowTheNextStep] = useState(false);
  const [questionsData, setQuestionsData] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const handleToggleComponent = () => {
    setShowTheNextStep(true);
    setStep("selectedPosts");};

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


  useEffect(() => {

  const fetchQuestions = async () => {
    if (tagged != "") {
      if (addNumber == 10 && questionsData != undefined && questionsData.has_more) {
        let n = pageNumber + 1;
        setPageNumber(n);
        setaddNumber(0);
        return;
      }

      //26 dont give
      if (pageNumber >= 26) {
        Swal.fire({
          title: "You reach the limit of the content.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Confirm",
        });
        return;
      }

      if (questionsData === "") {
        try {
          let api = "";
          api = `https://api.stackexchange.com/2.3/search/excerpts?page=${pageNumber}&pagesize=100&order=${order}&sort=${sort}&q=${tagged}&site=stackoverflow`;
          const response = await axios.get(api);
            const data = response.data; 
            if (data.items) {
              setQuestionsData(data);
              let i = addNumber * 10;
              let randomQuestions = [];
              while(randomQuestions.length < 10){
                if (i >= data.items.length) {
                  break; 
              }
              if(!uniqueQuestionsId.includes(data.items[i].question_id) ){
                  api = `https://api.stackexchange.com/2.3/questions/${data.items[i].question_id}?site=stackoverflow&filter=!nNPvSNPI7A`;
                  const questionData = await questionForAnswer(api);
                  randomQuestions.push(questionData.items[0]);
                  uniqueQuestionsId.push(questionData.items[0].question_id);
            }
                i++;
            }
            if (questions.length === 0)
              setQuestions(randomQuestions);
            else 
              questions.push(...randomQuestions);

            fetchAnswers(randomQuestions);
            }
        } 
        catch (error) {
          console.error("Error fetching data:", error);
        }
      } 


      else {
        if (questionsData.items) {
          let i = addNumber * 10;
          let randomQuestions = [];
          while(randomQuestions.length < 10){
            if (i >= questionsData.items.length) {
              break; 
          }
          if(!uniqueQuestionsId.includes(questionsData.items[i].question_id) ){
                
            // Its an answer
            // if(questionsData.items[i].item_type === "answer"){
              let api1 = `https://api.stackexchange.com/2.3/questions/${questionsData.items[i].question_id}?site=stackoverflow&filter=!nNPvSNPI7A`;
              const questionData1 = await questionForAnswer(api1);
              randomQuestions.push(questionData1.items[0]);
              uniqueQuestionsId.push(questionData1.items[0].question_id);
            // }

            // else{
            //   uniqueQuestionsId.push(questionsData.items[i].question_id);
            //   randomQuestions.push(questionsData.items[i]);

            // }
          }
            i++;
        }
        questions.push(...randomQuestions);
        fetchAnswers(randomQuestions);
        }
      }
      setaddNumber(addNumber + 1);
      search1 = true;
    }
  };
  if (search) {
    fetchQuestions(); 
    setSearch(false); 
  }
}, [search]);



const questionForAnswer = async (api) => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching question data:", error);
  }
};


  const toggleFilters = () => {
    const filtersBody = document.getElementById("accordion-collapse-body-4");
    filtersBody.classList.toggle("hidden");
  };

  const fetchAnswers = async (questions) => {
    if (questions.length > 0) {
      try {
        let api = "";
        const answersPromises = questions.map(async (question) => {
          api = `https://api.stackexchange.com/2.3/questions/${question.question_id}/answers?order=desc&sort=votes&pagesize=5&site=stackoverflow&filter=!6WPIomnMOOD*e`;
          let data;
          await axios.get(api).then((response) => {
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
    setQuestionsData("");
    setTagged(e.target.value);
    setaddNumber(0);
    uniqueQuestionsId = [];
  };

  const handleFormSubmit = async (e) => {
    setQuestionsData("");
    setaddNumber(0);
    uniqueQuestionsId = [];
    e.preventDefault();
    setQuestions([]);
    setExpandedQuestions({});
    setAnswers({});
    setExpandedAnswers({});
    setSelectedItems({});
    setSearch(true);
    search1 = false;
  };

  const handleChange = (questionId) => {
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
            confirmButtonText: "Confirm",
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
    // pageNumber++;
  }, [pageNumber]);

  

  return (
    <div className="flex flex-col  mt-6 mb-4">
      <Toolbar currentStep={step} />
      {step === "posts" ? (
        <div className="container mx-auto px-4">
          <div>
            <h1 className="text-center text-3xl font-bold mb-4 mt-8">
              Stack Overflow Questions Tagged with {tagged}
            </h1>
            <div className="mb-4">
              <p className="text-center text-gray-200 dark:text-gray-300">
                Welcome to the Stack Overflow Question Explorer!
              </p>
              <p className="text-left rtl:text-right text-gray-200 dark:text-gray-300">
                Enter the subject you're interested in, and we'll show you the
                10 most popular questions and their answers from Stack Overflow.
              </p>
              <p className="text-left rtl:text-right text-gray-200 dark:text-gray-300">
                After reviewing the questions, you can select up to 4 of them to
                create a professional post for publishing on your blog or other
                digital platforms.
              </p>
            </div>
          </div>
          <div>
            <form
              className="flex flex-col mb-4 max-w-screen-lg "
              onSubmit={handleFormSubmit}
            >
              <label className="mb-2 text-lg font-semibold">
                Enter Subject:*
              </label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={tagged}
                    onChange={handleTagChange}
                    className="w-full border rounded-l px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 ease-in-out"
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="absolute top-0 right-0  text-black rounded-r px-4 py-3 transition duration-300 ease-in-out focus:outline-none"
                  >
                    <BsSearch />
                  </button>
                </div>
              </div>
            </form>

            <div
              id="accordion-collapse"
              data-accordion="collapse"
              className="mb-10 flex flex-col max-w-screen-lg "
            >
              <h2 id="accordion-collapse-heading-4">
                <button
                  type="button"
                  className="flex items-center  justify-between w-full p-5 font-medium rtl:text-right text-gray-500 bg-gray-100 border  border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-400 dark:border-gray-300 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-200 gap-3 mb-4"
                  data-accordion-target="#accordion-collapse-body-4"
                  aria-expanded="false"
                  aria-controls="accordion-collapse-body-4"
                  onClick={toggleFilters}
                >
                  <span>Filters</span>
                  <svg
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-collapse-body-4"
                className="hidden"
                aria-labelledby="accordion-collapse-heading-4"
              >
                <div className="p-5  text-gray-500 bg-gray-100 border  border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-400 dark:border-gray-300 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-200 gap-3">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block">Sort By:</label>
                      <Select
                        defaultValue={filterQuestionsList[0]}
                        options={filterQuestionsList}
                        onChange={(e) => setSort(e.value)}
                      />
                    </div>
                    <div>
                      <label className="block">Order:</label>
                      <Select
                        defaultValue={orderQuestionsList[0]}
                        options={orderQuestionsList}
                        onChange={(e) => setOrder(e.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="mt-3 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={handleFormSubmit}
                  >
                    apply filters
                  </button>
                </div>
              </div>
              {Object.keys(checkedItems).length > 0 && (
                <button
                  type="button"
                  className="text-white bg-gradient-to-r mt-4 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={handleToggleComponent}
                >
                  Move to the next step
                </button>
              )}
            </div>
          </div>

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

          {search1 && questions.length >= 10 && (
            <div className="nextPageLink">
              <button
                className="mt-4 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                type="button"
                onClick={() => {
                  setSearch(true);
                  // fetchQuestions();
                }}
              >
                Display 10 additional results{" "}
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
