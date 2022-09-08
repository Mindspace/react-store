import { useState } from 'react';

import { MESSAGES } from './messages.service';
import { MessagesViewModel } from './messages.interfaces';

import { onlyFilteredMessages } from './messages.utils';

export function useMessages(): MessagesViewModel {
  const [filterBy, updateFilter] = useState('');
  const [messages] = useState(MESSAGES);

  return [filterBy, onlyFilteredMessages([messages, filterBy]), updateFilter];
}
