import React from 'react';
import usePosts from '../../Hooks/usePosts';
import PostPreview from '../PostPreview';
import { css } from 'glamor'

const PostArchive = () => {

  const {posts, loading} = usePosts();

  if (loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  const postArchiveRule = css({
    "display": "grid",
    "grid-template-columns": "1fr 1fr 1fr",
    "grid-template-rows": "auto",
    "column-gap": "16px",
    "row-gap": "16px",
    "width": "100%",
  });

  return (
    <div {...postArchiveRule}>
      {posts.map(({id}) => {

        return (
          <PostPreview id={id} />
        )

      })}
    </div>
  )

};

export default PostArchive;