import React from 'react';
import {css} from "glamor";
import useSettings from "../../../../Hooks/useSettings";

const Loaded = ({id, published, name, author, image = false, ...props}) => {

  const {settings} = useSettings();

  const postPreviewRule = css({
    "backgroundColor": settings['brand-secondary-bg'],
    "cursor": "pointer",
    "display": "flex",
    "flexDirection": "row",
    "minHeight": "150px",
  });

  const imageRule = css({
    "backgroundColor": settings['dark-bg'],
    "position": "relative",
    "minWidth": "50%",
  });

  const subTextRule = css({
    "color": settings["brand-secondary-text"],
    "fontSize": "14px"
  });

  const titleRule = css({
    "color": settings['brand-secondary-text'],
    "margin": "auto 0 0 0",
    "fontSize": "16px",
  });

  const authorRule = css({
    "marginBottom": 0,
    "marginTop": 0,
  });

  return (
    <a href={process.env.REACT_APP_SITE_URL + "#posts/" + id} {...postPreviewRule} className={"PostPreview"}>
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
