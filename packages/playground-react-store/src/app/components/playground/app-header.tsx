import React, { useState } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { NavButton } from './demos.constants';

export type AppHeaderProps = { buttons: NavButton[] };

const enum ButtonStyles {
  Active = 'bg-gray-900 text-white',
  Idle = 'text-gray-300 hover:bg-gray-700 hover:text-white',
}

export const AppHeader: React.FC<AppHeaderProps> = ({ buttons }) => {
  const location = useLocation();
  const history = useHistory();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const isActive = (it: NavButton) => location.pathname == it.url;
  const toggleMenu = () => setMenuOpen((s) => !s);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 ">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden ">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open Menu</span>
              <svg
                onClick={toggleMenu}
                className={`${isMenuOpen ? 'hidden' : 'block'}  h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                onClick={toggleMenu}
                className={`${!isMenuOpen ? 'hidden' : 'block'}  h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div
              className="flex-shrink-0 text-gray-200 hover:text-green-400 lg:pr-32 md:pr-16 pr-4 mt-1"
              onClick={() => history.push('/')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="24px"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {buttons.map((it) => {
                  return (
                    <NavLink
                      to={it.url}
                      className={`${
                        isActive(it) ? ButtonStyles.Active : ButtonStyles.Idle
                      } px-3 py-2 rounded-md text-sm font-medium `}
                      aria-current="page"
                      key={it.url}
                    >
                      {' '}
                      {it.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://lh3.googleusercontent.com/ogw/ADGmqu_PX1sbMQhIA5glNnLYHX7qA_e1CglIHMOXucQYbgs=s64-c-mo"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={isMenuOpen ? 'block' : 'hidden'} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {buttons.map((it) => {
            return (
              <NavLink
                to={it.url}
                className={`${
                  isActive(it) ? ButtonStyles.Active : ButtonStyles.Idle
                } block px-3 py-2 rounded-md text-base font-medium`}
                aria-current="page"
                key={it.url}
              >
                {' '}
                {it.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
