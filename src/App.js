import React from 'react';
import Page from './Page';
import usePages from './Hooks/usePages';
import useRoute from './Hooks/useRoute';
import Widgets from './Widgets';
import './App.scss';

function App() {

  const {loading, getCurrentPage} = usePages();
  const {route, setRoute} = useRoute();

  if (loading) {
    return (
      <div>Loading</div>
    )
  }

  const currentPage = getCurrentPage(route);

  return (
    <div>
      <Page>
        <div className={"BlockPage"}>
          {currentPage.widgets.map(({name, children, ...other}) => {

            return (
              <Widgets
                Cmp={name}
                route={route}
                setRoute={setRoute}
                {...other}
              >
                {children}
              </Widgets>);
          })}
        </div>
      </Page>
    </div>
  )

}

export default App;
