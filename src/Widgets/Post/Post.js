import React, {useEffect, useState} from 'react';
import usePosts from '../../Hooks/usePosts';
import Readme from "../Readme/Readme";
import HeroHeader from '../HeroHeader';

const Post = ({id, ...props}) => {

  const {loading, getPost} = usePosts();

  if (loading) {
    return null;
  }

  const post = getPost(Number(id));


  return (
    <>
      <HeroHeader title={post.name} subtitle={`By ${post.author}`}/>
      <Readme readmeUrl={process.env.REACT_APP_SITE_URL + "/posts/" + post.file} {...props} />
    </>
  )

};

export default Post;