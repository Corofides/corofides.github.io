import React from 'react';
import {css} from 'glamor';
import useSettings from '../../Hooks/useSettings';

const HeroHeader = ({title, subtitle}) => {

  const {settings} = useSettings();

  const HeroHeaderRule = css({
    "backgroundColor": settings['brand-secondary-bg'],
    "marginLeft": -16,
    "marginRight": -16,
    "padding": "38px 16px",
  });

  const titleRule = css({
    color: settings['brand-secondary-text'],
    fontSize: "3em",
    marginTop: 0,
    marginBottom: 16
  });

  const subtitleRule = css({
    color: settings['brand-secondary-text'],
    fontSize: "1em",
    margin: 0
  });


  return (
    <div {...HeroHeaderRule} >
      <h1 {...titleRule}>{title}</h1>
      <h2 {...subtitleRule}>{subtitle}</h2>
    </div>
  )

};

export default HeroHeader;