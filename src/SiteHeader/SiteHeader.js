import React from 'react';
import useSettings from '../Hooks/useSettings';
import './SiteHeader.scss';
import { css } from 'glamor';

export default () => {

  const {settings} = useSettings();

  const headerRule = css({
    "background-color": settings['brand-primary-bg'],
    "padding": "16px",
    "width": "100%",
    "box-sizing": "border-box",
  });

  const contentRule = css({
    "display": "flex",
    "align-items": "baseline",
    "justify-content": "space-between",
    "width": "100%",
    "max-width": "1920px",
    "margin": "0 auto",
    "color": settings['brand-primary-text'],
    "text-decoration": "none",
  });

  const siteNameRule = css({
    "color": settings['brand-primary-text'],
    "text-decoration": "none",
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
        <nav />
      </div>
    </header>
  )

}

