import React from 'react';

import { query } from './messages.interfaces';
import { useMessageStore } from './messages.store';

/**
 * Show list of messages that container the searchCriteria
 */
export const FilteredMessages: React.FC = () => {
  const [searchCriteria, messages, updateSearchBy] = useMessageStore(query);

  return (
    <div className="max-w-xl w-full rounded-lg shadow-lg p-4 flex flex-wrap bg-white">
      <div className="demo max-w-xl bg-white px-4 py-5 sm:px-6" style={{ height: '197px' }}>
        <div className="filterBy">
          <label htmlFor="filterBy"> Filter by: </label>
          <input type="text" value={searchCriteria} onChange={(e) => updateSearchBy(e.target.value)} />
        </div>
        <ul className="">
          {messages.map((msg, i) => (
            <li className="message" key={i} dangerouslySetInnerHTML={{ __html: msg }} />
          ))}
        </ul>
      </div>
    </div>
  );
};
