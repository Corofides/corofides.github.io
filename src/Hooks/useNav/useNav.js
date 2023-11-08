import React, {useState, useEffect} from 'react';

const useNav = () => {

  const [navigation, setNavigation] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {

    setLoading(true);

    fetch(process.env.REACT_APP_SITE_URL + '/navigation.json').then(response => response.json()).then((result) => {

      setNavigation(result);
      setLoading(false);

    })

  }, []);

  const getNavForPosition = (position) => {

    if (!navigation.hasOwnProperty(position)) {
      return [];
    }

    return navigation[position];

  }

  return {navigation, loading, getNavForPosition}

};

export default useNav;