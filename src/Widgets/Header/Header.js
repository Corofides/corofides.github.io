import React from 'react';
import './Header.scss';

const Header = ({children, ...props}) => {

  return (
    <h1 {...props}>{children}</h1>
  )

};

export default Header;