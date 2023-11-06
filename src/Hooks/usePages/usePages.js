import React, {useState, useEffect} from 'react';
import UrlPattern from 'url-pattern';


const usePages = () => {

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {


    console.log("ProcessEnv", process.env);

    fetch( process.env.REACT_APP_SITE_URL + '/pages/pages.json').then(response => response.json()).then((result) => {

      const newPages = result.map(({widgets, ...other}) => {

        let colPos = 1;

        return {
          widgets: widgets.map(({colSpan = 1, ...other}) => {

            const newWidget = {
              colPos: colPos + colSpan > 4 ? 1 : colPos,
              colSpan: colSpan,
              ...other,
            };

            colPos = colPos + colSpan;

            if (colPos > 3) {
              colPos = 1;
            }

            return newWidget;

          }),
          ...other
        }

      });

      setLoading(false);
      setPages(newPages);

    });

  }, []);

  // Todo Revisit this as I don't like the way it works.
  const getCurrentPage = () => {

    let currentUrl = "/";
    const hashSplit = window.location.href.split('#');

    if (hashSplit.length > 1) {
      currentUrl += hashSplit[1];
    }

    const page = pages.find(({location}) => {

      const pagePattern = new UrlPattern(location);
      return pagePattern.match(currentUrl) !== null;

    });

    const resultFromMatch = new UrlPattern(page.location).match(currentUrl);

    for (const key in resultFromMatch) {

      page.widgets = page.widgets.map((widget) => {

        console.log("Widget", widget);

        if (widget.hasOwnProperty('_' + key)) {

          delete widget['_' + key];
          widget[key] = resultFromMatch[key];

        }

        return widget;

      })

    }

    return page;

  };

  return {pages, loading, error, getCurrentPage}

};

export default usePages;