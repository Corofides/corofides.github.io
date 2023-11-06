import React from 'react';
import usePosts from '../../Hooks/usePosts';
import PostPreview from '../PostPreview';
import {css} from "glamor";

const LatestPosts = ({header = "Latest Posts", total = 3, ...props}) => {

  const {posts, loading} = usePosts();

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  const latestPostsRule = css({
    "display": "grid",
    "grid-template-columns": "1fr 1fr 1fr",
    "grid-template-rows": "auto",
    "column-gap": "16px",
    "row-gap": "16px",
    "width": "100%",
  });

  return (
    <div {...props}>
      <h2>{header}</h2>
      <div {...latestPostsRule}>
        {posts.slice(0, total).map(({id}) => {
          return (
            <PostPreview id={id} />
          )
        })}
      </div>
    </div>
  )

};

export default LatestPosts;