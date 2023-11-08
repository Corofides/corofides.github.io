import React, {useEffect, useState} from 'react';
import Markdown from 'react-markdown';


const Readme = ({readmeUrl, ...other}) => {

  const [readme, setReadme] = useState("");

  useEffect(() => {

    fetch(readmeUrl).then(result => result.text()).then(result => {
      setReadme(result);
    })

  });

  return (
    <div>
      <Markdown className={"Readme"}>
        {readme}
      </Markdown>
    </div>
  )

};

export default Readme;