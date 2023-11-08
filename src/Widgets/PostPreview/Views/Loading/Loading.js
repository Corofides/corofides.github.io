import React from 'react';
import useSettings from '../../../../Hooks/useSettings'
import {css} from "glamor";

const Loading = () => {

  const {settings} = useSettings();

  const postPreviewRule = css({
    "backgroundColor": settings['brand-secondary-bg'],
    "cursor": "pointer",
    "display": "flex",
    "flexDirection": "row",
    "minHeight": "150px",
  });

  const subTextRule = css({
    "color": settings["brand-secondary-text"],
    "backgroundColor": settings['neutral-bg'],
    "opacity": 0.3,
    "height": "14px",
    "width": "100%",
  });

  const titleRule = css({
    "color": settings['brand-secondary-text'],
    "backgroundColor": settings['neutral-bg'],
    "margin": "auto 0 8px 0",
    "fontSize": "16px",
    "height": "14px",
    "width": "100%",
    "opacity": "0.3",
  });

  const authorRule = css({
    "marginBottom": 0,
    "marginTop": 0,
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