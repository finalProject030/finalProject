import React, { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import Select from 'react-select'
import { LuFilter } from "react-icons/lu";



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
  const [checkedItems, setCheckedItems] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState(false);
  const [nextPageLink, setNextPageLink] = useState(false);
  const [sort, setSort] = useState("votes");
  const [order, setOrder] = useState("desc");

  const filterQuestionsList = [
    { value: 'votes', label: 'Votes (deafult)' },
    { value: 'activity', label: 'Activity' },
    { value: 'creation', label: 'Cration date' },
    { value: 'relevance', label: 'Relevance' },

  ]

  const orderQuestionsList = [
    { value: 'desc', label: 'Desc (deafult)' },
    { value: 'asc', label: 'Asc' }
  ]
  const dateQuestions = [
    { value: 'desc', label: 'From date' },
    { value: 'asc', label: 'To date' }
  ]




  



  const fetchQuestions = async () => {
    try {
        let api = "";
        if (sort !== "relevance")
          api = `https://api.stackexchange.com/2.3/search/advanced?order=${order}&sort=${sort}&q=${tagged}&site=stackoverflow&filter=!6WPIomnMOOD*e`;
        else
          api = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&q=${tagged}&site=stackoverflow&filter=!nNPvSNPI7A`;
        // filter=!nNPvSNPI3D

      // console.log(api);
      const response = await fetch(api);
      const data = await response.json();
      if (data.items) {
        // Display 10 random questions
        const randomQuestions = data.items.slice(0, pageNumber * 10);
        console.log(randomQuestions);
        setQuestions(randomQuestions);
        // Fetch answers for each question
        fetchAnswers(randomQuestions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };




  const fetchAnswers = async (questions) => {
    let api = ""
    const answersPromises = questions.map(async (question) => {
      if (sort !== "relevance") 
        api =  `https://api.stackexchange.com/2.3/questions/${question.question_id}/answers?order=${order}&sort=${sort}&site=stackoverflow&filter=!6WPIomnMOOD*e`

      else
        api = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&title=react&site=stackoverflow&filter=!6WPIomnMOOD*e`

      const response = await fetch(api);
      const data = await response.json();
      return { questionId: question.question_id, answers: data.items };
    });

    const answersData = await Promise.all(answersPromises);
    const answersMap = {};
    answersData.forEach(({ questionId, answers }) => {
      answersMap[questionId] = answers;
    });

    setAnswers(answersMap);
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
    setSearch(true);
    e.preventDefault();
    // Fetch data when the user presses Enter
    fetchQuestions();
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
          // Add an object with questionId and its corresponding answers
          updatedItems[questionId] = {
            questionId: questionId,
            answers: answers[questionId],
          };
        } else {
          // If there are already 4 selected items, do not add more
          window.alert('You can only select up to 4 items.');
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









  
  return (
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

        <div>
           <h1> Filters <LuFilter /> </h1>
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
              {question.title}
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
              inputProps={{ 'aria-label': 'controlled' }}
              />
          </div>
        ))}
      </div>

      { search && questions.length >= 10 && (
      <div className="nextPageLink">
        <button 
        type="button"
        onClick={() => {
          setPageNumber(pageNumber + 1);
          fetchQuestions();}}
        >
          Show more 10 results
        </button>
        </div>
      )
}


    </div>
  );
};

export default Posts;
