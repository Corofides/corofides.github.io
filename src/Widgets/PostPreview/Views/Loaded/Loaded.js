import React from 'react';
import {css} from "glamor";
import useSettings from "../../../../Hooks/useSettings";

const Loaded = ({id, published, name, author, image = false, ...props}) => {

  const {settings} = useSettings();

  const postPreviewRule = css({
    "background-color": settings['brand-secondary-bg'],
    "cursor": "pointer",
    "display": "flex",
    "flex-direction": "row",
    "min-height": "150px",
  });

  const imageRule = css({
    "background-color": settings['dark-bg'],
    "position": "relative",
    "min-width": "50%",
  });

  const subTextRule = css({
    "color": settings["brand-secondary-text"],
    "font-size": "14px;"
  });

  const titleRule = css({
    "color": settings['brand-secondary-text'],
    "margin": "auto 0 0 0",
    "font-size": "16px",
  });

  const authorRule = css({
    "margin-bottom": 0,
    "margin-top": 0,
  });

  return (
    <a href={process.env.REACT_APP_SITE_URL + "#posts/" + id} {...props} {...postPreviewRule} className={"PostPreview"}>
      {image ? <div {...imageRule} className={"PostPreview__Image"} /> : null}
      <div className={"PostPreview__Info"}>
        <span {...subTextRule} className={"PostPreview__Published"}>{published}</span>
        <h2 {...titleRule} className={"PostPreview__Title"}>{name}</h2>
        <h3 {...subTextRule} {...authorRule} className={"PostPreview__Author"}>By {author}</h3>
      </div>
    </a>
  )

};

export default Loaded;
