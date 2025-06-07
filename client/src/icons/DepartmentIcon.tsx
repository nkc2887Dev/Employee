import React from 'react';
const DepartmentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 3v4M8 3v4M3 13h18" />
  </svg>
);
export default DepartmentIcon;
