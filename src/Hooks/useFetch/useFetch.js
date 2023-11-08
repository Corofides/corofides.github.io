import React, {useState, useEffect} from 'react';
import {DateTime} from 'luxon';

const useFetch = (location) => {

  const MINUTES_TO_CACHE = 5;

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState("");

  const getCachedResponse = (key) => {

    const values = localStorage.getItem(key);

    if (values === null) {
      return {
        isValid: false,
        isLoading: false,
      }
    }

    const valueObject = JSON.parse(values);

    if (!valueObject.hasOwnProperty('timestamp')) {
      return {
        isValid: false,
        isLoading: false,
      }
    }

    if (valueObject.hasOwnProperty('loading') && values.loading) {
      return {
        isValid: false,
        isLoading: true,
      }
    }


    if (DateTime.fromMillis(valueObject.timestamp) <= DateTime.now().plus({"minutes": MINUTES_TO_CACHE})) {
      return {
        isValid: false,
        isLoading: false,
      }
    }

    return {
      isValid: true,
      isLoading: false,
      value: JSON.parse(values).value,
    }

  };

  const setCachedResponse = (key, value) => {

    localStorage.setItem(key, value);

  };

  useEffect(() => {

    const response = getCachedResponse(location);

    if (response.isLoading) {
      return;
    }

    if (response.isValid) {

      setLoading(false);
      setResult(response.value);
      return;

    }

    console.log("I hate this");

    setLoading(true);
    setCachedResponse(location, JSON.stringify({
      "loading": true,
      "timestamp": DateTime.now().toMillis(),
    }));


    fetch(location).then(result => result.text()).then(result => {

      setLoading(false);
      setCachedResponse(location, JSON.stringify({
        "loading": false,
        value: result,
        "timestamp": DateTime.now().toMillis(),
      }));
      setResult(result);

    })

  }, []);

  return {loading, result}

};

export default useFetch;