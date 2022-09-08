import React, { useContext, useState } from 'react';

import { EmailService } from './messages.service';
import { MessagesState } from './messages.interfaces';
import { makeStore } from './messages.store';

const service = new EmailService();

export const AsyncMessages: React.FC = () => {
  const [useMessageStore] = useState(() => makeStore(service));

  const state: MessagesState = useMessageStore();
  const hasMessages = state.messages.length > 0;

  return (
    <div className="max-w-xl w-full rounded-lg shadow-lg p-4 flex flex-wrap bg-white">
      <div className="demo max-w-xl bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="pb-4 text-lg leading-6 font-medium text-gray-900">{hasMessages ? 'Messages Loaded:' : null}</h3>
        {!state.isLoading && (
          <ul className="">
            {state.messages.map((msg, i) => (
              <li className="message" key={i}>
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end" style={{ width: '100%' }}>
        {!state.isLoading && (
          <>
            <button
              onClick={state.refresh}
              className="bg-blue-500 text-white font-bold px-4 py-2 mr-4 text-sm uppercase rounded tracking-wider focus:outline-none hover:bg-blue-600"
            >
              {hasMessages ? 'Refresh' : 'Load All'}
            </button>
            <button
              onClick={useMessageStore.reset}
              className="bg-red-500 text-white font-bold px-4 py-2 mr-4 text-sm uppercase rounded tracking-wider focus:outline-none hover:bg-blue-600"
            >
              Reset
            </button>
          </>
        )}
        {state.isLoading && (
          <div className="flex justify-around items-center">
            <span className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="px-4 py-2 inline-flex border border-transparent text-base leading-6 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:border-red-700 active:bg-red-700 cursor-not-allowed"
                disabled={state.isLoading}
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing! <span className="text-gray-300 pl-4">(...{state.timeToReady})</span>
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsyncMessages;
