import React, {useState, useEffect} from 'react';

const useRoute = () => {

  const [route, setRoute] = useState('/');

  window.onhashchange = () => {
    console.log("Hash Change");
    const url = window.location.href;
    setRoute(getRouteFromURL(url));
  }

  const getRouteFromURL = (url) => {

    let currentRoute = "/";
    const hashSplit = window.location.href.split('#');

    if (hashSplit.length > 1) {
      currentRoute += hashSplit[1];
    }

    return currentRoute;

  };

  useEffect(() => {

    const url = window.location.href;
    setRoute(getRouteFromURL(url));

  }, []);


  return {route, setRoute};

};

export default useRoute;