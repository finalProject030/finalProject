import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { recoilSelectedPosts, recoilSelectedStep } from "../recoil/state";
import PostCreationForm from "../components/PostForm";

export default function SelectedPosts() {
  const [selectedItems, setSelectedItems] = useRecoilState(recoilSelectedPosts);
  const [step, setStep] = useRecoilState(recoilSelectedStep);

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

  return (
    <div className="container mx-auto p-4">
      {step === "selectedPosts" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Selected Posts Component:</h2>
          {Object.entries(selectedItems).map(([questionId, item]) => (
            <div
              key={questionId}
              className="mb-8 bg-gray-100 rounded-lg p-4 border border-gray-300"
            >
              <h3 className="text-xl font-semibold mb-2">
                Question ID: {questionId}
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Question Body:</h4>
                <div dangerouslySetInnerHTML={{ __html: item.body }} />
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
                          className="mb-2 bg-gray-200 rounded p-2"
                        >
                          <strong className="text-green-600">Accepted:</strong>{" "}
                          Yes
                          <br />
                          <strong className="text-lg font-semibold">
                            Answer {index + 1}:
                          </strong>
                          <div
                            className="ml-4"
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
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Unselect
              </button>
            </div>
          ))}
          <button
            onClick={moveToPostsPage}
            className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Move back
          </button>
          <button
            onClick={moveToFormPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Move to the next step
          </button>
        </>
      )}
      {step === "postCreationForm" && <PostCreationForm />}
    </div>
  );
}
