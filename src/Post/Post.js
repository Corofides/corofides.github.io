import React, {useState, useEffect} from 'react';
import Markdown from 'react-markdown';
import './Post.scss';

export default ({post}) => {

  const [loading, setLoading] = useState(true);
  const [markdown, setMarkdown] = useState(false);

  console.log("Post", post);

  useEffect(() => {

    fetch("/Shimmer/posts/" + post.file).then(response => response.text()).then((text) => {
      console.log("Post", text);
      setMarkdown(text);
      setLoading(false);
    });

  }, []);

  if (loading) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <Markdown className={"Post"}>
      {markdown}
    </Markdown>
  )

}