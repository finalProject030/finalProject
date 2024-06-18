import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  recoilSelectedPosts,
  recoilSelectedStep,
  globalJsonData,
} from "../recoil/state";
import PostCreationForm from "../components/PostForm";
import { scrollToTop } from "../variables";

export default function SelectedPosts() {
  const [selectedItems, setSelectedItems] = useRecoilState(recoilSelectedPosts);
  const [step, setStep] = useRecoilState(recoilSelectedStep);
  const [globalJsonState, setGlobalJsonData] = useRecoilState(globalJsonData);

  useEffect(() => {
    // Build the global JSON when selectedItems change
    buildGlobalJson();
    scrollToTop();
  }, [selectedItems]);

  const moveToPostsPage = () => {
    setStep("posts");
  };

  const moveToFormPage = () => {
    setStep("postCreationForm");
  };

  const unselectItem = (questionId) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = { ...prevSelectedItems };
      delete updatedSelectedItems[questionId];
      return updatedSelectedItems;
    });
  };

  const buildGlobalJson = () => {
    // console.log(Object.entries(selectedItems));
    const newGlobalJson = {
      selectedPosts: Object.entries(selectedItems).map(
        ([questionId, item]) => ({
          id: questionId,
          bodyMessage: item.body,
          acceptedAnswers: item.answers
            ? item.answers
                .filter((answer) => answer.is_accepted)
                .map((acceptedAnswer) => ({
                  id: acceptedAnswer.answer_id,
                  body: acceptedAnswer.body,
                }))
            : [],
        })
      ),
    };
    setGlobalJsonData(newGlobalJson);
  };

  return (
    <div className="bg-cover bg-no-repeat bg-center flex flex-col my-20 justify-center items-center space-y-6 w-full px-4">
      {step === "selectedPosts" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Selected Posts Component:</h2>
          {Object.entries(selectedItems).map(([questionId, item]) => (
            <div
              key={questionId}
              className="mb-8 bg-gray-100 overflow-auto rounded-lg p-4 border border-gray-300 break-words w-full md:w-auto"
            >
              <h3 className="text-xl font-semibold mb-2">
                Question ID: {questionId}
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Question Body:</h4>
                <div
                  className="text-wrap"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Accepted Answers:
                </h4>
                <ul>
                  {item.answers &&
                    item.answers
                      .filter((answer) => answer.is_accepted)
                      .map((acceptedAnswer, index) => (
                        <li
                          key={acceptedAnswer.answer_id}
                          className="mb-2 bg-gray-200 rounded p-2 break-words overflow-auto"
                        >
                          <strong className="text-green-600 break-words">
                            Accepted:
                          </strong>{" "}
                          Yes
                          <br />
                          <strong className="text-lg font-semibold break-words">
                            Answer {index + 1}:
                          </strong>
                          <div
                            className="ml-4 word-wrap break-word text-wrap break-words"
                            dangerouslySetInnerHTML={{
                              __html: acceptedAnswer.body,
                            }}
                          />
                        </li>
                      ))}
                </ul>
              </div>
              <button
                onClick={() => unselectItem(questionId)}
                className="mt-4 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Unselect
              </button>
            </div>
          ))}
          <button
            onClick={moveToPostsPage}
            className="mt-4 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Move back
          </button>
          {Object.keys(selectedItems).length > 0 && (
            <button
              onClick={moveToFormPage}
              className="text-white bg-gradient-to-r mt-4 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Move to the next step
            </button>
          )}
        </>
      )}
      {step === "postCreationForm" && <PostCreationForm />}
    </div>
  );
}
