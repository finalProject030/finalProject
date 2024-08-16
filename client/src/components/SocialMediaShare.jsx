import React from "react";

import { SocialIcon } from "react-social-icons";

export default function SocialMediaShare(props) {
  // Encoded the text of the post
  const encodedTitle = encodeURIComponent(props.title);
  const encodedContent = encodeURIComponent(props.content);
  const text = encodeURIComponent(props.text);
  const iconStyle = {
    marginRight: "10px", // Space between icons
    width: "40px", // Adjust width
    height: "40px", // Adjust height
  };

  return (
    // <div>
    //   <SocialIcon
    //     url={"https://www.linkedin.com/shareArticle?mini=true&text=" + text}
    //     target="_blank"
    //     style={iconStyle} // Space between icons
    //   />

    //   <SocialIcon
    //     url={"https://x.com/intent/tweet?text=" + text}
    //     target="_blank"
    //     style={iconStyle} // Space between icons
    //   />

    //   <SocialIcon
    //     url={
    //       "https://www.reddit.com/web/submit?title=" +
    //       encodedTitle +
    //       "&text=" +
    //       encodedContent +
    //       "&type=TEXT"
    //     }
    //     target="_blank"
    //     style={iconStyle} // Space between icons
    //   />
    // </div>
    <div>
      <SocialIcon
        url={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedContent}&title=${encodedTitle}&text=${text}`}
        target="_blank"
        style={iconStyle}
      />

      <SocialIcon
        url={`https://mobile.twitter.com/intent/tweet?text=${text}`}
        target="_blank"
        style={iconStyle}
      />

      <SocialIcon
        url={`https://www.reddit.com/submit?url=${encodedContent}&title=${encodedTitle}`}
        target="_blank"
        style={iconStyle}
      />
    </div>
  );
}
