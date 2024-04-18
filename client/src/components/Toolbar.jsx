const Toolbar = ({ currentStep }) => {
  return (
    <div className=" left-0 top-0 bg-gray-200 w-32 h-screen flex flex-col items-center justify-center">
      <div
        className={`h-1/3 w-1/2 rounded-full mb-4 ${
          currentStep === "posts" ? "bg-green-500" : "bg-gray-400"
        } flex items-center justify-center text-white font-bold`}
      >
        <span>STEP 1</span>
      </div>
      <div
        className={`h-1/3 w-1/2 rounded-full mb-4 ${
          currentStep === "selectedPosts" ? "bg-green-500" : "bg-gray-400"
        } flex items-center justify-center text-white font-bold`}
      >
        <span>STEP 2</span>
      </div>
      <div
        className={`h-1/3 w-1/2 rounded-full mb-4 ${
          currentStep === "postCreationForm" ? "bg-green-500" : "bg-gray-400"
        } flex items-center justify-center text-white font-bold`}
      >
        <span>STEP 3</span>
      </div>
    </div>
  );
};

export default Toolbar;
