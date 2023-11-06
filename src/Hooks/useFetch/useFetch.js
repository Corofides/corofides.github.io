import React, {useState, useEffect} from 'react';

const useFetch = (location) => {

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState("");

  const getCachedResponse = (key) => {

    const values = localStorage.getItem(key);

    if (values === null) {
      return {
        isValid: false,
      }
    }

    return {
      isValid: true,
      value: values,
    }

  };

  const setCachedResponse = (key, value) => {

    localStorage.setItem(key, value);

  };

  useEffect(() => {



    const response = getCachedResponse(location);
    console.log("useFetch", "Response", response);


    if (response.isValid) {

      setLoading(false);
      setResult(response.value);
      return;

    }

    if (loading) {
      return;
    }

    setLoading(true);

    fetch(location).then(result => result.text()).then(result => {

      setLoading(false);
      setCachedResponse(location, result);
      setResult(result);

    })

  }, []);

  return {loading, result}

};

export default useFetch;