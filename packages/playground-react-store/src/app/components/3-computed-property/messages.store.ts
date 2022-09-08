import { createStore, StoreEffect } from '@mindspace-io/react-store';

import { MessageService } from './messages.service';
import { MessagesStore } from './messages.interfaces';
import { onlyFilteredMessages } from './messages.utils';

/*******************************************
 * Instantiate store with state
 * Note: The `filteredMessages` value is updated via a 'computed' property
 *******************************************/

const service = new MessageService();

export const useMessageStore = createStore<MessagesStore>(
  ({ set, addComputedProperty }, useStoreEffect: StoreEffect = () => {}) => {
    // Create store with API and initializations
    const store = {
      filterBy: '',
      messages: [], // all messages
      updateFilter(filterBy: string) {
        set((s) => {
          s.filterBy = filterBy;
        });
      },
      filteredMessages: [],
    };

    // Async side effect to 1x load all messages
    useStoreEffect(() => {
      service.loadAll().then((messages) => {
        set((d) => {
          d.messages = messages;
        });
      });
    }, []);

    // Create a computed property dependent on two (2) queries
    // and chain a transformation operator to add search match highlights

    return addComputedProperty(store, {
      name: 'filteredMessages',
      selectors: [
        (s: MessagesStore) => s.messages,
        (s: MessagesStore) => s.filterBy,
      ],
      transform: onlyFilteredMessages,
    });
  }
);
