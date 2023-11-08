import React from 'react';
import useSettings from '../Hooks/useSettings';
import './SiteHeader.scss';
import { css } from 'glamor';
import useNav from "../Hooks/useNav";

export default () => {

  const {settings} = useSettings();
  const {getNavForPosition, loading} = useNav();

  const headerRule = css({
    "backgroundColor": settings['brand-primary-bg'],
    "padding": "16px",
    "width": "100%",
    "boxSizing": "border-box",
  });

  const contentRule = css({
    "display": "flex",
    "alignItems": "baseline",
    "justifyContent": "space-between",
    "width": "100%",
    "maxWidth": "1920px",
    "margin": "0 auto",
    "color": settings['brand-primary-text'],
    "textDecoration": "none",
  });

  const siteNameRule = css({
    "color": settings['brand-primary-text'],
    "textDecoration": "none",
    "margin": 0,
  });

  return (
    <header {...headerRule} className={"Header"}>
      <div {...contentRule} className={"Content"}>
        <h1 {...siteNameRule} className={"SiteName"}>
          <a {...siteNameRule} href={process.env.REACT_APP_SITE_URL}>
            {settings.site_name}
          </a>
        </h1>
        <nav>
            {getNavForPosition("main").map((item, index) => {
              return (
                <a key={index} href={process.env.REACT_APP_SITE_URL + "#" + item.location}>{item.label}</a>
              )
            })}
        </nav>
      </div>
    </header>
  )

}

