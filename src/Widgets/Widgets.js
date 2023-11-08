import React from 'react';
import Header from './Header';
import Text from './Text';
import PostPreview from './PostPreview';
import Readme from './Readme';
import Accordion from './Accordion';
import Post from './Post';
import PostArchive from './PostArchive'
import LatestPosts from './LatestPosts';

import { css } from 'glamor';

const Widgets = ({Cmp, children = null, colPos = 1, colSpan = 1, ...other}) => {

  let widgetRule = css({
    'gridColumn': colPos + " / span " + colSpan
  });

  const widgetComponents = {
    "Header": Header,
    "Text": Text,
    "PostPreview": PostPreview,
    "Readme": Readme,
    "Accordion": Accordion,
    "Post": Post,
    "PostArchive": PostArchive,
    "LatestPosts": LatestPosts,
  };

  if (!widgetComponents[Cmp]) {
    return (
      <strong>Could not render element</strong>
    );
  }

  return (
    <div {...widgetRule}>
      {React.createElement(widgetComponents[Cmp], {...other}, children)}
    </div>
  )

};

export default Widgets;