import React, {useState, useEffect} from 'react';


const useSettings = () => {

  const [settings, setSettings] = useState({
    "site_name": "",
    "site_owner": ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log("useSettings", process.env);

  useEffect(() => {

    fetch(process.env.REACT_APP_SITE_URL + '/settings.json').then(response => response.json()).then((result) => {

      setLoading(false);
      setSettings(result);

    });

  }, []);

  return {error, loading, settings}

};

export default useSettings;