import React from 'react';
import useSettings from '../Hooks/useSettings';
import { css } from 'glamor';

export default () => {

  const {settings} = useSettings();

  const footerRule = css({
    "padding": "16px",
    "background-color": settings['dark-bg'],
    "color": settings['brand-secondary-text'],
    "width": "100%",
    "position": "fixed",
    "bottom": 0,
    "box-sizing": "border-box",
  });

  const contentRule = css({
    "max-width": "1920px",
    "width": "100%",
    "margin": "0 auto",
    "display": "flex",
    "justify-content": "space-between",
  });

  const textRule = css({
    "text-decoration": "none",
    "color": settings['brand-secondary-text'],
  });

  return (
    <footer {...footerRule} className={"Footer"}>
      <div {...contentRule} className={"Content"}>
        <a {...textRule} href={"#"}>{settings.site_owner}</a>
        <div {...textRule}>
          Powered by <a href={"https://github.com/Corofides/Shimmer"} {...textRule}>Shimmer</a>
        </div>
      </div>
    </footer>
  )

}