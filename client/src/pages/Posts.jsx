import React, { useEffect, useState } from "react";

const HTMLCodeDisplay = ({ htmlCode }) => {
  return (
    <pre
      dangerouslySetInnerHTML={{ __html: htmlCode }}
      className="max-w-full overflow-x-auto"
    />
  );
};

const Posts = () => {
  const [tagged, setTagged] = useState("react"); // Default tag
  const [questions, setQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetching data for questions with the specified tag
        const response = await fetch(
          `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=${tagged}&site=stackoverflow&filter=!6WPIomnMOOD*e`
        );
        const data = await response.json();
        if (data.items) {
          // Shuffle the array of questions
          const shuffledQuestions = shuffleArray(data.items);
          // Display a certain number of random questions (e.g., 5)
          const randomQuestions = shuffledQuestions.slice(0, 10);
          setQuestions(randomQuestions);
        }
        // console.log(questions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchQuestions();
  }, [tagged]);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleTagChange = (e) => {
    setTagged(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fetch questions for the specified tag when the form is submitted
    fetchData();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Stack Overflow Questions Tagged with {tagged}
      </h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="mr-2">
          Enter Tag:
          <input
            type="text"
            value={tagged}
            onChange={handleTagChange}
            className="border p-2"
          />
        </label>
        {/* <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Fetch Questions
        </button> */}
      </form>
      <div className="grid grid-cols-1  gap-4">
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
                ? "Collapse HTML Code"
                : "Expand HTML Code"}
            </button>
            {expandedQuestions[question.question_id] && (
              <HTMLCodeDisplay htmlCode={question.body} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
