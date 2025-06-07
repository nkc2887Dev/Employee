import React from 'react';
const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="6" width="18" height="14" rx="2" stroke="red" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="red" />
    <line x1="10" y1="11" x2="10" y2="17" stroke="red" />
    <line x1="14" y1="11" x2="14" y2="17" stroke="red" />
    <line x1="4" y1="6" x2="20" y2="6" stroke="red" />
  </svg>
);
export default DeleteIcon;
