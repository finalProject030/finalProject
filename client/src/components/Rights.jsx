import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { recoilSelectedStep } from "../recoil/state";
import { useNavigate } from "react-router-dom";

const Rights = ({ geminiResponse, title, content }) => {
  const [step, setStep] = useRecoilState(recoilSelectedStep);
  const navigate = useNavigate();

  const moveToHomePage = () => {
    setStep("posts");
    navigate("/");
  };

  useEffect(() => {
    const cleanup = () => {
      moveToHomePage();
    };

    // Attach event listener for beforeunload
    window.addEventListener("beforeunload", cleanup);

    return () => {
      // Cleanup function to remove event listener
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return (
    <div className="h-full p-8 bg-gradient-to-r from-blue-200 to-indigo-200 flex flex-col items-center justify-center">
      <button
        onClick={moveToHomePage}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        Back Home
      </button>

      <p className="text-gray-800 text-lg leading-relaxed text-center max-w-prose bg-white bg-opacity-70 p-6 rounded-lg shadow-md">
        All rights reserved &copy; STACK TEXTPRO.<br></br>
        This includes but is not limited to the rights of reproduction,
        distribution, adaptation, and public display of all content, materials,
        and intellectual property owned or created by STACK TEXTPRO. <br></br>
        No part of our proprietary information, including text, graphics, logos,
        images, audio, or video content, may be reproduced, distributed,
        transmitted, or otherwise utilized without the express written
        permission of STACK TEXTPRO.<br></br>
        Any unauthorized use or reproduction of our intellectual property will
        be subject to legal action.<br></br>
      </p>
    </div>
  );
};

export default Rights;
