/* eslint-disable */

import { renderHook, act } from '@testing-library/react-hooks';
import {
  makeInjector,
  InjectionToken,
  fakeTimeWithAct,
  ReactTesting,
} from '@mindspace-io/core';

import { createStore } from '../reactive-store';
import {
  StateSelector,
  UseStore,
  State,
  GetState,
  StateSelectorList,
} from '../reactive-store.interfaces';

// ************************************
// Define custom types for testing only
// ************************************

type MessageState = {
  messages?: string[];
  numViews?: number;
  incrementCount?: () => void;
  saveMessages?: (list: string[]) => void;

  // Computed
  numMessages?: number;
};

interface EmailState extends State {
  emails: string[];
  numViews?: number;
  saveEmails?: (list: string[]) => void;
}

type EmailList = string[];
type SaveEmailsFn = (list: string[]) => void;
type EmailAndSaveFn = [EmailList, SaveEmailsFn, boolean];

// ************************************
// Test suites
// ************************************

import 'regenerator-runtime/runtime';

describe('UseStore state management', () => {
  beforeAll(() => {
    ReactTesting.act = act;
  });

  describe('createStore()', () => {
    it('should create a store', () => {
      const useStore = createStore<EmailState>(({ set }) => ({
        emails: [],
        saveEmails: (emails) => set({ emails }),
      }));

      expect(useStore).toBeTruthy();
      // Check API
      expect(useStore.observe).toBeTruthy();
      expect(useStore.destroy).toBeTruthy();
    });

    it('should create a store and subscribe for entire state', () => {
      let state: EmailState = undefined;
      const store = createStore<EmailState>(({ set }) => ({
        emails: ['ThomasBurleson@gmail.com'],
        saveEmails: (emails) => set({ emails }),
      }));

      expect(store).toBeTruthy();

      // Subscribe to all state changes
      const unsubscribe = store.observe((source) => {
        state = source;
      });

      expect(state.emails.length).toBe(1);
      expect(state.emails[0]).toBe('ThomasBurleson@gmail.com');
      expect(state.saveEmails).toBeDefined();

      expect(state.error).toBeDefined();
      expect(state.isLoading).toBeDefined();
      expect(state.isLoading).toBe(false);

      state.saveEmails([]);
      expect(state.emails.length).toBe(0);

      unsubscribe(); // ignore future state changes

      state.saveEmails(['ThomasBurleson@gmail.com']);
      expect(state.emails.length).toBe(0);
    });

    it('should create a store and subscribe for partial slice of state', () => {
      let store: EmailState;
      let emails: string[] = undefined;

      const hook = createStore<EmailState>(({ set }) => {
        return (store = {
          emails: ['ThomasBurleson@gmail.com'],
          saveEmails: (emails) => set({ emails }),
        });
      });

      // Subscribe to all state changes
      const unsubscribe = hook.observe<string[]>(
        source => { emails = source }, // prettier-ignore
        (s) => s.emails
      );

      expect(emails.length).toBe(1);
      expect(emails[0]).toBe('ThomasBurleson@gmail.com');
      expect(store.saveEmails).toBeDefined();

      store.saveEmails([]);
      expect(emails.length).toBe(0);

      unsubscribe(); // ignore future state changes

      store.saveEmails(['ThomasBurleson@gmail.com']);
      expect(emails.length).toBe(0);
    });
  });

  describe('createStore() with onInit notifications', () => {
    it('should notify initialization done', () => {
      let notified = false;
      const useStore = createStore<EmailState>(({ set }, useStoreEffect) => {
        // side affect to run on initialization
        useStoreEffect(() => {notified = true; },[]); // prettier-ignore

        return {
          emails: [],
          saveEmails: (emails) => set({ emails }),
        };
      });

      // initialization notification is synchronous
      expect(notified).toBe(true);
    });

    it('should cleanup sideaffect during destroy', () => {
      let notified = 0;
      const useStore = createStore<EmailState>(({ set }, useStoreEffect) => {
        useStoreEffect(() => {
          notified = 1; // sideaffect
          return () => {
            notified += 1;
          }; // should be called on `destroy()`
        }, []);

        return {
          emails: [],
          saveEmails: (emails) => set({ emails }),
        };
      });

      expect(notified).toBe(1);
      useStore.destroy();
      expect(notified).toBe(2);
    });

    it('should not cleanup sideaffect during reset', () => {
      let notified = 0;
      const useStore = createStore<EmailState>(({ set }, useStoreEffect) => {
        useStoreEffect(() => {
          notified = 1; // sideaffect
          return () => {
            notified += 1;
          }; // should not be called on `reset()`
        }, []);

        return {
          emails: [],
          saveEmails: (emails) => set({ emails }),
        };
      });

      expect(notified).toBe(1);
      useStore.reset();
      expect(notified).toBe(1);
    });
  });

  describe('createStore() Hooks', () => {
    it(
      'should reset store from the hook',
      fakeTimeWithAct((act, done) => {
        const hook = createStore<EmailState>(({ set }) => ({
          emails: [],
          saveEmails: (emails) => set({ emails }),
        }));
        const { result } = renderHook<UseStore<EmailState>, EmailState>(hook);

        act(() => result.current.saveEmails(['ThomasBurleson@gmail.com']));
        expect(result.current.emails.length).toBe(1);

        act(() => hook.reset());
        expect(result.current.emails.length).toBe(0);

        done();
      })
    );

    it(
      'should not reset normal store when unmounted',
      fakeTimeWithAct((act) => {
        const hook = createStore<EmailState>(({ set }) => ({
          emails: [],
          saveEmails: (emails) => set({ emails }),
        }));
        const { result, unmount, rerender } = renderHook<
          UseStore<EmailState>,
          EmailState
        >(hook);
        expect(result.current.emails.length).toBe(0);

        act(() => result.current.saveEmails(['ThomasBurleson@gmail.com']));
        expect(result.current.emails.length).toBe(1);

        unmount();
        rerender();

        // Without StateCreatorOptions 'autoReset: true', store is cached and shared
        // regardless of components unmounting
        expect(result.current.emails.length).toBe(1);
      })
    );

    it(
      'should reset store from resettable store when unmounted',
      fakeTimeWithAct((act) => {
        const hook = createStore<EmailState>(
          ({ set }) => ({
            emails: [],
            saveEmails: (emails) => set({ emails }),
          }),
          { autoReset: true } // when component unmounts, autoreset store
        );
        const { result, unmount, rerender } = renderHook<
          UseStore<EmailState>,
          EmailState
        >(hook);
        expect(result.current.emails.length).toBe(0);

        act(() => result.current.saveEmails(['ThomasBurleson@gmail.com']));
        expect(result.current.emails.length).toBe(1);

        unmount();
        rerender();

        // Only because we set the StateCreatorOptions 'autoReset'
        expect(result.current.emails.length).toBe(0);
      })
    );
  });

  describe('createStore() with pagination', () => {
    let useStore: UseStore<EmailState>;

    afterEach(() => {
      useStore.destroy();
    });

    it('should inject pagination state', () => {
      useStore = createStore<EmailState>(({ get, paginate }, onInit) => {
        const rawList = [...new Array(90).keys()].map((v) => String(v + 1));
        const store = { emails: rawList };
        onInit(() => {
          paginate(rawList, 20);

          const { paginatedList, totalPages, goToPage } = get().pagination;

          expect(totalPages).toBe(5); // 90/20 > 4
          expect(paginatedList.length).toBe(20);
          expect(goToPage).toBeDefined();
        });

        return store;
      });
    });

    it('should paginate without affecting other state values', () => {
      const rawList = [...new Array(90).keys()].map((v) => String(v + 1));
      useStore = createStore<EmailState>(({ set, get, paginate }, onInit) => {
        const store = { emails: [] };

        onInit(() => {
          paginate(rawList, 20); // only paginate 'rawlist'
          const { paginatedList } = get().pagination;

          expect(paginatedList.length).toBe(20);
          expect(get().emails.length).toBe(0);
        });

        return store;
      });
    });

    it('should paginate computed properties', async () => {
      const rawList = [...new Array(200).keys()].map((v) => String(v + 1));
      const evenValuesOnly = (list: string[]) =>
        list.filter((it, i) => i % 2 == 0);
      const squashList = (list: string[]) =>
        list.slice(0, Math.floor(list.length / 2));

      const hook = createStore<any>(
        ({ set, addComputedProperty, paginate }) => {
          const store = {
            allKeys: [...rawList],
            evenKeys: [],
            compress: () => {
              set((s) => {
                const { allKeys } = s;
                s.allKeys = squashList(allKeys);
              });
            },
          };

          return addComputedProperty(store, {
            name: 'evenKeys',
            selectors: (s) => s.allKeys,
            transform: (allKeys: string[]) => {
              return paginate(evenValuesOnly(allKeys), 40);
            },
          });
        }
      );

      // need to wait for computed property async initialization
      let { result, waitForNextUpdate } = renderHook<UseStore<any>, any>(hook);
      await waitForNextUpdate();

      const store1 = result.current;
      expect(store1.evenKeys.length).toBe(100);
      expect(store1.pagination.paginatedList.length).toBe(40);
      expect(store1.pagination.totalPages).toBe(3);

      act(() => {
        // compressing 'allkeys' recomputes 'evenKeys';
        // which triggers pagination updates
        store1.compress();
      });

      await waitForNextUpdate();

      const store2 = result.current;
      expect(store2.evenKeys.length).toBe(50);
      expect(store2.pagination.paginatedList.length).toBe(40);
      expect(store2.pagination.totalPages).toBe(2);

      hook.destroy();
    });

    it('should use paginate.on() to tailhook another function', async () => {
      const rawList = [...new Array(200).keys()].map((v) => String(v + 1));
      const evenValuesOnly = (list: string[]) =>
        list.filter((it, i) => i % 2 == 0);
      const squashList = (list: string[]) =>
        list.slice(0, Math.floor(list.length / 2));

      const hook = createStore<any>(
        ({ set, addComputedProperty, paginate }) => {
          const store = {
            allKeys: [...rawList],
            evenKeys: [],
            compress: () => {
              set((s) => {
                const { allKeys } = s;
                s.allKeys = squashList(allKeys);
              });
            },
          };

          return addComputedProperty(store, {
            name: 'evenKeys',
            selectors: (s) => s.allKeys,
            transform: paginate.on(evenValuesOnly, 40),
          });
        }
      );

      // need to wait for computed property async initialization
      let { result, waitForNextUpdate } = renderHook<UseStore<any>, any>(hook);
      await waitForNextUpdate();

      const store1 = result.current;

      expect(store1.allKeys.length).toBe(200);
      expect(store1.evenKeys.length).toBe(100);
      expect(store1.pagination.paginatedList.length).toBe(40);
      expect(store1.pagination.totalPages).toBe(3);
    });

    it('should navigate paged data', (done) => {
      const rawList = [...new Array(90).keys()].map((v) => String(v + 1));

      useStore = createStore<EmailState>(({ set, get, paginate }, onInit) => {
        const store = { emails: [] };
        onInit(() => {
          paginate(rawList, 20);

          expect(get().pagination.paginatedList[0]).toBe('1');
          expect(get().pagination.currentPage).toBe(1);

          get().pagination.goToPage(2); // mutates pagination state; hence 'get().pagination...'

          expect(get().pagination.paginatedList[0]).toBe('21');
          expect(get().pagination.currentPage).toBe(2);

          done();
        });

        return store;
      });
    });
  });

  describe('creates a store hook `useStore`', () => {
    let useStore: UseStore<EmailState>;

    beforeEach(() => {
      useStore = createStore(({ set }) => ({
        emails: ['ThomasBurleson@gmail.com'],
        saveEmails: (emails) => {
          set({ emails });
        },
      }));
    });

    afterEach(() => {
      useStore.destroy();
    });

    it(
      'should return entire state; when a selector is not specified',
      fakeTimeWithAct((act) => {
        const { result } = renderHook<UseStore<EmailState>, EmailState>(
          useStore
        );

        expect(result.current.emails.length).toBe(1);
        expect(result.current.emails[0]).toBe('ThomasBurleson@gmail.com');
        expect(result.current.saveEmails).toBeDefined();

        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBeDefined();
        expect(result.current.isLoading).toBe(false);

        act(() =>
          result.current.saveEmails([
            'Harry@hotpixelgroup.com',
            'Thomas.Burleson@ampf.com',
          ])
        );

        expect(result.current.emails.length).toBe(2);
        expect(result.current.isLoading).toBe(false);
      })
    );

    it(
      'should return a simply `slice` only when a simply selector is specified',
      fakeTimeWithAct((act, done) => {
        const { result: emails } = renderHook<
          StateSelector<EmailState, EmailList>,
          EmailList
        >(useStore, {
          initialProps: (s) => s.emails,
        });

        act(() => {}); // allow store to update and render

        expect(emails.current instanceof Array).toBe(true);
        expect(emails.current.length).toBe(1);

        done();
      })
    );

    it(
      'should return a complex `slice` only when a combined selector is specified',
      fakeTimeWithAct((act) => {
        const { result } = renderHook<
          StateSelectorList<EmailState, any>,
          EmailAndSaveFn
        >(useStore, {
          initialProps: [
            (s) => s.emails,
            (s) => s.saveEmails,
            (s) => s.isLoading,
          ],
        });
        const [emails, saveEmails, isLoading] = result.current;

        expect(emails).toBeDefined();
        expect(saveEmails).toBeInstanceOf(Function);
        expect(isLoading).toBe(false);
        expect(emails.length).toBe(1);

        act(() =>
          saveEmails(['Harry@hotpixelgroup.com', 'Thomas.Burleson@ampf.com'])
        );

        const [updatedEmails] = result.current;
        expect(updatedEmails.length).toBe(2);
      })
    );

    it(
      'should update state with value',
      fakeTimeWithAct((act) => {
        const { result } = renderHook<UseStore<EmailState>, EmailState>(
          useStore
        );
        expect(result.current.emails.length).toBe(1);

        act(() =>
          result.current.saveEmails([
            'Harry@hotpixelgroup.com',
            'Thomas.Burleson@ampf.com',
          ])
        );

        expect(result.current.emails.length).toBe(2);
        expect(result.current.emails[0]).toBe('Harry@hotpixelgroup.com');
      })
    );

    it(
      'update state with partial selector; confirm with getState()',
      fakeTimeWithAct((act) => {
        let store: MessageState;
        let getState: GetState<MessageState>;
        createStore<MessageState>(({ set, get }) => {
          getState = get;
          return (store = {
            numViews: 0,
            messages: [],
            saveMessages: (v) => v,
            incrementCount: () =>
              set((s: MessageState) => ({ numViews: s.numViews + 1 })),
          });
        });

        expect(store.numViews).toBe(0);

        act(() => store.incrementCount());

        const updated = getState();
        expect(updated.numViews).toBe(1);
      })
    );

    it(
      'update state with partial selector that returns new state',
      fakeTimeWithAct((act) => {
        const useStore = createStore<MessageState>(({ set }) => ({
          numViews: 0,
          incrementCount: () =>
            set((s: MessageState) => ({ numViews: s.numViews + 1 })),
        }));
        const initialProps = [(s) => s.numViews, (s) => s.incrementCount];
        const { result } = renderHook<any, [number, () => void]>(useStore, {
          initialProps,
        });

        expect(result.current[0]).toBe(0);
        act(() => {
          const incrementCount = result.current[1];
          incrementCount();
        });
        expect(result.current[0]).toBe(1);
      })
    );

    it(
      'update state with partial selector that modifies the draft',
      fakeTimeWithAct((act) => {
        const useStore = createStore<MessageState>(({ set }) => ({
          numViews: 0,
          incrementCount: () =>
            set((draft: MessageState) => {
              draft.numViews += 1; // just modify the draft... Immer manages the immutability
            }),
        }));
        const initialProps = [(s) => s.numViews, (s) => s.incrementCount];
        const { result } = renderHook<any, [number, () => void]>(useStore, {
          initialProps,
        });

        expect(result.current[0]).toBe(0);
        act(() => {
          const incrementCount = result.current[1];
          incrementCount();
        });
        expect(result.current[0]).toBe(1);
      })
    );
  });

  describe('enforces immutability', () => {
    it('should create immutable state', () => {
      let getState: GetState<MessageState>;
      const useStore = createStore<MessageState>(({set, get}) => {
        getState = get;
        return ({ messages: [], saveMessages: (v) => v });
      }); // prettier-ignore

      const state = getState();
      const origSaveMessages = state.saveMessages;
      const origMessages = state.messages;

      expect(state.messages.length).toBe(0);

      try { state.messages = [];           } catch (e) {} // prettier-ignore
      try { state.messages.push('Msg #1'); } catch (e) {} // prettier-ignore
      try { state.saveMessages = (v) => v  } catch (e) {} // prettier-ignore

      expect(state.messages).toBe(origMessages);
      expect(state.messages.length).toBe(0);
      expect(state.saveMessages === origSaveMessages).toBe(true);
    });

    it('should emit immutable state from an "empty" hook ', () => {
      const useStore = createStore<MessageState>(({set}) => ({ messages: [], saveMessages: (v) => v })); // prettier-ignore
      const { result } = renderHook<UseStore<MessageState>, MessageState>(
        useStore
      );
      const origSaveMessages = result.current.saveMessages;
      const origMessages = result.current.messages;

      expect(result.current.messages.length).toBe(0);

      try { result.current.messages = [];           } catch (e) {} // prettier-ignore
      try { result.current.messages.push('Msg #1'); } catch (e) {} // prettier-ignore
      try { result.current.saveMessages = (v) => v  } catch (e) {} // prettier-ignore

      expect(result.current.messages).toBe(origMessages);
      expect(result.current.messages.length).toBe(0);
      expect(result.current.saveMessages === origSaveMessages).toBe(true);
    });

    it('should emit immutable state from an hook + selector ', () => {
      const useStore = createStore<MessageState>(({set}) => ({ messages: [], saveMessages: (v) => v })); // prettier-ignore
      const { result } = renderHook<
        StateSelector<MessageState, string[]>,
        string[]
      >(useStore, {
        initialProps: (s) => s.messages,
      });
      const messages = result.current;
      expect(messages.length).toBe(0);

      try { messages.push('Msg #1'); } catch (e) {} // prettier-ignore
      expect(messages.length).toBe(0);
    });
  });

  describe('with Computed properties', () => {
    let useStore;
    let enableWarnings;
    let watchedCounter = 0;
    let getState: GetState<MessageState>;

    beforeEach(() => {
      enableWarnings = silentWarnings();
      console.warn = () => {};

      useStore = createStore<MessageState>(
        ({ set, get, addComputedProperty, watchProperty }) => {
          getState = get;

          const store = {
            numViews: 1,
            numMessages: 0,
            messages: ['Message #1', 'Message #2'],
            saveMessages: (v: string[]) =>
              set((s) => {
                s.messages = [...s.messages, ...v];
              }),
            incrementCount: () =>
              set((s) => {
                s.numViews += 1;
              }),
          };

          addComputedProperty(store, {
            name: 'numMessages',
            selectors: (s: MessageState) => s.messages,
            initialValue: 2,
            transform: (messages: string[]) => {
              // console.log(`transform 'numMessages' => ${messages.length}`);
              return messages.length;
            },
          });

          watchProperty(store, 'messages', () => {
            watchedCounter += 1;
          });

          return store;
        }
      );
    });

    afterEach(() => {
      watchedCounter = 0;
      useStore.destroy();
      enableWarnings();
    });

    it('should access initialized computed properties', () => {
      expect(getState().numMessages).toBe(2);
    });

    it(
      'should access rendered async computed properties',
      fakeTimeWithAct((act) => {
        const { result } = renderHook<UseStore<MessageState>, MessageState>(
          useStore
        );

        expect(result.current.numViews).toBe(1);
        expect(result.current.numMessages).toBe(2);

        // Change that DOES trigger the computed property
        act(() =>
          result.current.saveMessages(['Test Message #3', 'Test Message #4'])
        );

        expect(result.current.numViews).toBe(1);
        expect(result.current.numMessages).toBe(4);

        // Change that does NOT affect the computed property
        act(() => result.current.incrementCount());

        expect(result.current.numViews).toBe(2);
        expect(result.current.numMessages).toBe(4);
      })
    );

    it(
      'should access handle watched properties',
      fakeTimeWithAct((act) => {
        const { result } = renderHook<UseStore<MessageState>, MessageState>(
          useStore
        );

        expect(result.current.numMessages).toBe(2);
        expect(watchedCounter).toBe(1);

        // Change that DOES trigger the computed property
        act(() =>
          result.current.saveMessages(['Test Message #3', 'Test Message #4'])
        );

        expect(result.current.numMessages).toBe(4);
        expect(watchedCounter).toBe(2);

        // Change that does NOT affect the computed property
        act(() => result.current.incrementCount());

        expect(result.current.numMessages).toBe(4);
        expect(watchedCounter).toBe(2);
      })
    );
  });

  describe('from DependencyInjection', () => {
    const hookToken = new InjectionToken('[useStore hook]');
    const createStoreWith = () => {
      const useStore = createStore(({ set }) => ({
        emails: ['ThomasBurleson@gmail.com'],
        saveEmails: (emails) => set({ emails }),
      }));
      return useStore;
    };
    const injector = makeInjector([
      { provide: hookToken, useFactory: () => createStoreWith() },
    ]);

    expect(injector.get(hookToken)).toBe(injector.get(hookToken));
  });
});

/**
 * Computed and Watched property setup will issue
 * warnings if the selectors are not optimized.
 *
 * For testing, we want to silence this output.
 */
function silentWarnings() {
  const original = console.warn;
  console.warn = () => {};
  return () => {
    console.warn = original;
  };
}
