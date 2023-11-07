import React, {useEffect, useState} from 'react';
import usePosts from '../../Hooks/usePosts';
import Readme from "../Readme/Readme";

const Post = ({id, ...props}) => {

  const {loading, getPost} = usePosts();

  if (loading) {
    return null;
  }

  const post = getPost(Number(id));


  return (
    <Readme readmeUrl={process.env.REACT_APP_SITE_URL + "/posts/" + post.file} {...props} />
  )

};

export default Post;