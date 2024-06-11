import React from "react";

const Rights = ({ geminiResponse, title, content }) => {
  return (
    <div className="h-full">
      <button>Back Home</button>

      <p>
        <br></br>
        <br></br>
        <br></br>
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
