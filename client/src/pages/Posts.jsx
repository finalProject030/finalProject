import React, { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';


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


  const fetchQuestions = async () => {
    try {
      // Fetching data for questions with the specified tag
      const response = await fetch(
        `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=${tagged}&site=stackoverflow&filter=!6WPIomnMOOD*e`
      );
      const data = await response.json();
      if (data.items) {
        // Display a certain number of random questions (e.g., 5)
        const randomQuestions = data.items.slice(0, 10);
        setQuestions(randomQuestions);
        // Fetch answers for each question
        fetchAnswers(randomQuestions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAnswers = async (questions) => {
    const answersPromises = questions.map(async (question) => {
      const response = await fetch(
        `https://api.stackexchange.com/2.3/questions/${question.question_id}/answers?order=desc&sort=votes&site=stackoverflow&filter=!6WPIomnMOOD*e`
      );
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
    </div>
  );
};

export default Posts;
