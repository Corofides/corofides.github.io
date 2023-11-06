import React, {useState, useEffect} from 'react';
import useFetch from '../useFetch';
import useSettings from '../useSettings';

const usePosts = () => {

  const {result: cachedPosts, loading: cachedLoading} = useFetch( process.env.REACT_APP_SITE_URL + '/posts/posts.json');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    console.log("GetCached", cachedLoading, cachedPosts);


    if (!cachedLoading) {

      console.log("CachedPosts", cachedPosts);
      setPosts(JSON.parse(cachedPosts));
      setLoading(false);
      return;

    }

    setPosts([]);
    setLoading(true);

  }, [cachedPosts, cachedLoading]);

  const getPost = (id) => {
    return posts.find((post) => {return post.id === id});
  };

  return {posts, loading, getPost}


};

export default usePosts;