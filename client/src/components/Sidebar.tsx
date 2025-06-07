import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  EmployeeIcon,
  DepartmentIcon,
  MoneyIcon,
  BarChartIcon,
  AwardIcon,
  MenuIcon,
  CloseIcon,
} from '../icons';
import ROUTES from '../utils/constants/routes';

const navItems = [
  {
    name: 'Employees',
    href: ROUTES.EMPLOYEES,
    icon: <EmployeeIcon className="w-6 h-6" />,
  },
  {
    name: 'Departments',
    href: ROUTES.DEPARTMENTS,
    icon: <DepartmentIcon className="w-6 h-6" />,
  },
];

const statisticsItems = [
  {
    name: 'Department Salaries',
    href: ROUTES.STATISTICS_DEPARTMENT_SALARIES,
    icon: <MoneyIcon className="w-6 h-6" />,
  },
  {
    name: 'Salary Ranges',
    href: ROUTES.STATISTICS_SALARY_RANGES,
    icon: <BarChartIcon className="w-6 h-6" />,
  },
  {
    name: 'Youngest Employees',
    href: ROUTES.STATISTICS_YOUNGEST_EMPLOYEES,
    icon: <AwardIcon className="w-6 h-6" />,
  },
];

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [statsOpen, setStatsOpen] = useState(false);
  const location = useLocation();

  // Helper to check if any statistics route is active
  const isStatisticsActive = location.pathname.startsWith('/statistics');

  return (
    <div
      className={`h-screen bg-white shadow-lg flex flex-col transition-all duration-200 ${open ? 'w-56' : 'w-16'}`}
    >
      <button
        className="p-4 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      >
        {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>
      <nav className="flex-1 mt-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 ${
              location.pathname.startsWith(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!open ? item.name : undefined}
          >
            {item.icon}
            {open && <span className="text-base font-medium">{item.name}</span>}
          </Link>
        ))}
        {/* Statistics Dropdown */}
        <div className="mt-6">
          <button
            className={`flex items-center gap-3 px-4 py-2 w-full rounded-md transition-colors duration-150 focus:outline-none ${
              isStatisticsActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setStatsOpen((prev) => !prev)}
            onMouseEnter={() => !open && setStatsOpen(true)}
            onMouseLeave={() => !open && setStatsOpen(false)}
            title={!open ? 'Statistics' : undefined}
            aria-expanded={statsOpen}
            aria-controls="sidebar-statistics-menu"
            type="button"
          >
            <BarChartIcon className="w-6 h-6" />
            {open && <span className="text-base font-medium flex-1 text-left">Statistics</span>}
            {open && (
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${statsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
          {(open ? statsOpen : isStatisticsActive) && (
            <div
              id="sidebar-statistics-menu"
              className={`ml-${open ? '0' : '2'} mt-1 space-y-1 ${open ? '' : 'pl-2'}`}
              onMouseEnter={() => !open && setStatsOpen(true)}
              onMouseLeave={() => !open && setStatsOpen(false)}
            >
              {statisticsItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!open ? item.name : undefined}
                  style={!open ? { marginLeft: 0 } : {}}
                >
                  {item.icon}
                  {open && <span className="text-base font-medium">{item.name}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
