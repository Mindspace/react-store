import React, { useCallback } from 'react';

import { CounterViewModel, QueryCounter } from './counter.interfaces';
import { useCounter as useCounterStore, CounterState } from './counter.store';

// ************************************
//  (1) Main approach:
//
// ************************************

export const SimpleCounter: React.FC = () => {
  const { count, incrementCount, decrementCount } = useCounterStore();

  return (
    <div className="max-w-xl w-full rounded-lg shadow-lg p-4 flex flex-wrap bg-white">
      <div className="max-w flex-2">
        <h3 className="font-semibold text-lg tracking-wide">
          Total Votes <span className={`${count < 3 ? 'bg-red-200' : 'bg-green-300'} p-1`}>{count}</span>
        </h3>
        <p className="text-gray-500 my-1">
          Before you can work remote, you need a minimum of <span className="bg-gray-100 p-1">3</span> 'yes' votes.
        </p>
      </div>

      <div className="mt-3 flex items-end">
        <button
          onClick={incrementCount}
          className="bg-blue-500 text-white font-bold px-4 py-2 mr-4 text-sm uppercase rounded tracking-wider focus:outline-none hover:bg-blue-600"
        >
          ▲ Vote Yes
        </button>
        <button
          onClick={decrementCount}
          className="bg-red-400 text-white font-bold px-4 py-2 text-sm uppercase rounded tracking-wider focus:outline-none hover:bg-red-600"
        >
          ▼ Vote No
        </button>
      </div>
    </div>
  );
};

// ************************************
//  (2) Alternate approach:
//
//  Since the selector is defined inside the render function,
//  we must employ `useCallback()` !!
//
//  Note: We could define the selector outside the render function and then
//        the `useCallback()` would not be needed.
// ************************************

export const SimpleCounterAlternate: React.FC = () => {
  const selector: QueryCounter = useCallback((s: CounterState) => {
    return [s.count, s.decrementCount, s.incrementCount];
  }, []);
  const [count, decrement, increment] = useCounterStore(selector);

  return null;
};
