import React from 'react';

import { SocialIcon } from 'react-social-icons'


export default function SocialMediaShare(props) {
  // Encoded the text of the post
  const encodedTitle = encodeURIComponent(props.title);
  const encodedContent = encodeURIComponent(props.content);
  const text=encodeURIComponent(props.text);

  return ( 
    <div>

      <SocialIcon url={'https://www.facebook.com/share_channel?mini=true&text=blabla' + text}
        target="_blank"/>

      <SocialIcon url={'https://www.linkedin.com/shareArticle?mini=true&text=' + text}
        target="_blank"/>

      <SocialIcon url={'https://twitter.com/intent/tweet?text=' + text}
          target="_blank"/>
            
      <SocialIcon url={'https://www.reddit.com/submit?title=' + encodedTitle + '&text=' + encodedContent}
        target="_blank"/>
    
    </div>   

  );
}
