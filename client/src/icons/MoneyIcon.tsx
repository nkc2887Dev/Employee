import React from 'react';
const MoneyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="7" width="20" height="10" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 7V5M18 7V5" />
  </svg>
);
export default MoneyIcon;
