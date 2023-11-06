import React from 'react';
import Page from './Page';
import usePages from './Hooks/usePages';
import Widgets from './Widgets';
import './App.scss';

function App() {

  const {loading, getCurrentPage} = usePages();

  if (loading) {
    return (
      <div>Loading</div>
    )
  }

  const currentPage = getCurrentPage();

  return (
    <div>
      <Page>
        <div className={"BlockPage"}>
          {currentPage.widgets.map(({name, children, ...other}) => {
            return (
              <Widgets Cmp={name} {...other}>{children}</Widgets>
            )
          })}
        </div>
      </Page>
    </div>
  )

}

export default App;
