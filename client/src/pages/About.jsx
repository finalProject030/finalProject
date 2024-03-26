import React from "react";
import { useRecoilState } from "recoil";
import { recoilSelectedPosts } from "../recoil/state";

export default function About() {
  const [selectedItems, setSelectedItems] = useRecoilState(recoilSelectedPosts);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">About</h2>
      {Object.entries(selectedItems).map(([questionId, item]) => (
        <div key={questionId} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">
            Question ID: {questionId}
          </h3>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Question Body:</h4>
            <div dangerouslySetInnerHTML={{ __html: item.body }} />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Accepted Answers:</h4>
            <ul>
              {item.answers &&
                item.answers
                  .filter((answer) => answer.is_accepted)
                  .map((acceptedAnswer) => (
                    <li key={acceptedAnswer.answer_id} className="mb-2">
                      <strong className="text-green-600">Accepted:</strong> Yes
                      <br />
                      <strong className="text-lg font-semibold">
                        Answer Body:
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
        </div>
      ))}
    </div>
  );
}
