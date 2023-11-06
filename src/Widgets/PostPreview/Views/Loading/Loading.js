import React from 'react';
import useSettings from '../../../../Hooks/useSettings'
import {css} from "glamor";

const Loading = () => {

  const {settings} = useSettings();

  const postPreviewRule = css({
    "background-color": settings['brand-secondary-bg'],
    "cursor": "pointer",
    "display": "flex",
    "flex-direction": "row",
    "min-height": "150px",
  });

  const subTextRule = css({
    "color": settings["brand-secondary-text"],
    "background-color": settings['neutral-bg'],
    "opacity": 0.3,
    "height": "14px",
    "width": "100%",
  });

  const titleRule = css({
    "color": settings['brand-secondary-text'],
    "background-color": settings['neutral-bg'],
    "margin": "auto 0 8px 0",
    "font-size": "16px",
    "height": "14px",
    "width": "100%",
    "opacity": "0.3",
  });

  const authorRule = css({
    "margin-bottom": 0,
    "margin-top": 0,
  });

  return (
    <div {...postPreviewRule} className={"PostPreview"}>
      <div className={"PostPreview__Info"}>
        <span {...subTextRule} className={"PostPreview__Published"} />
        <div {...titleRule} className={"PostPreview__Title"} />
        <div {...subTextRule} {...authorRule} className={"PostPreview__Author"} />
      </div>
    </div>
  )

};

export default Loading;