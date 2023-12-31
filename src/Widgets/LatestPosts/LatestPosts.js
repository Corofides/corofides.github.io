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
    "gridTemplateColumns": "1fr 1fr 1fr",
    "gridTemplateRows": "auto",
    "columnGap": "16px",
    "rowGap": "16px",
    "width": "100%",
  });

  return (
    <div>
      <h2>{header}</h2>
      <div {...latestPostsRule}>
        {posts.slice(0, total).map(({id}) => {
          return (
            <PostPreview key={id} id={id} />
          )
        })}
      </div>
    </div>
  )

};

export default LatestPosts;