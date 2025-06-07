import React from 'react';

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
    <rect x="3" y="6" width="14" height="2" rx="1" />
    <rect x="3" y="12" width="14" height="2" rx="1" />
  </svg>
);

export default MenuIcon;
