import React from 'react';
const BarChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="12" width="4" height="8" />
    <rect x="9" y="8" width="4" height="12" />
    <rect x="15" y="4" width="4" height="16" />
  </svg>
);
export default BarChartIcon;
