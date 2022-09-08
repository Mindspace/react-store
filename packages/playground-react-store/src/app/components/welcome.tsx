import React from 'react';
import { NavLink } from 'react-router-dom';

import { CodeBox } from './_ui/code-box';

export const Welcome: React.FC = () => {
  return (
    <div className="markdown relative bg-gray-50 pt-4 overflow-hidden sm:pt-2">
      <div className="max-w-md px-4 text-center sm:max-w-3xl lg:max-w-7xl">
        <p className="tip text-gray-400">Select a demo ^ to explore the ideas and solutions.</p>
        <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">React Developers</h2>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Reactive State Management? No problem!
        </p>
      </div>
      <div className="max-w text-left pl-10">
        <p className="mt-10 max-w-prose text-xl text-gray-500">
          Reactive state management is a solution predicated on the architecture patterns of Observable data and "1-Way
          Data Flows"
        </p>
        <div className="max-w flex justify-left p-8">
          <img src="assets/1-way-data-flow.png" alt="1-way Data Flow" width="75%" />
        </div>

        <p className="mt-5 max-w-prose text-xl text-gray-500">
          This playground provides several examples that show how to build reactive user experiences with
          <span className="highlight ml-5">Reactive Stores</span>
          . And creating your reactive store is so easy... you don't even need to know RxJS!
          <br />
          <br />
          Below is the code used to create the Reactive store in the
          <span className="code link hover:text-indigo-500">
            <NavLink to="/demos/simple-counter">Simple Counter</NavLink>
          </span>
          demo:
        </p>

        <div className="max-w flex justify-left p-2 mt-4">
          <CodeBox
            style="height: 287px;"
            fileName="simple-counter.store.ts"
            src="https://carbon.now.sh/embed?bg=rgba%28249%2C250%2C251%2C0%29&t=one-dark&wt=none&l=application%2Ftypescript&ds=true&dsyoff=6px&dsblur=8px&wc=true&wa=true&pv=0px&ph=0px&ln=true&fl=1&fm=Hack&fs=13.5px&lh=133%25&si=false&es=2x&wm=false&code=import%2520%257B%2520createStore%2520%257D%2520from%2520%27%2540mindspace-io%252Freact%27%253B%250Aimport%2520type%2520%257B%2520CounterState%2520%257D%2520from%2520%27.%252Fcounter.interfaces%27%253B%250A%250Aexport%2520const%2520useCounter%2520%253D%2520createStore%253CCounterState%253E%28%28%257B%2520set%2520%257D%29%2520%253D%253E%2520%28%257B%250A%2520%2520count%253A%25200%252C%250A%2520%2520incrementCount%28%29%2520%257B%250A%2520%2520%2520%2520set%28%28s%29%2520%253D%253E%2520%257B%2520%2520s.count%2520%252B%253D%25201%253B%2520%257D%29%253B%250A%2520%2520%257D%252C%250A%2520%2520decrementCount%28%29%2520%257B%250A%2520%2520%2520%2520set%28%28s%29%2520%253D%253E%2520%257B%2520%2520s.count%2520-%253D%25201%253B%2520%257D%29%253B%250A%2520%2520%257D%252C%250A%257D%29%29%253B"
          />
        </div>
      </div>
    </div>
  );
};
