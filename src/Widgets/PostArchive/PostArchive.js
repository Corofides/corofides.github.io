import React from 'react';
import usePosts from '../../Hooks/usePosts';
import PostPreview from '../PostPreview';
import { css } from 'glamor'

const PostArchive = () => {

  const {posts, loading, publishedPosts} = usePosts();

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  const postArchiveRule = css({
    "display": "grid",
    "gridTemplateColumns": "1fr 1fr 1fr",
    "gridTemplateRows": "auto",
    "columnGap": "16px",
    "rowGap": "16px",
    "width": "100%",
  });

  return (
    <div {...postArchiveRule}>
      {publishedPosts.map(({id}) => {

        return (
          <PostPreview key={id} id={id} />
        )

      })}
    </div>
  )

};

export default PostArchive;