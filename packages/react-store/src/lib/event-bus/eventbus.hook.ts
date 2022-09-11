/* eslint-disable */
import { useEffect, useState, useContext, useCallback, Context } from 'react';
import { EmitEvent, EventBus, DependencyInjector } from '@mindspace-io/core';

import { Unsubscribe } from '../reactive-store';
import { InjectorContext } from '../di';

/**
 * Internal type to keep code terse
 */
export type ListenerArgs = [event: string, notify: (data: unknown) => void];

/**
 * Response type for the useEventBus() hook
 */
export type HookResponse = [
  (event: EmitEvent<unknown>) => void, // notify
  (event: string, notify: (data: unknown) => void) => void // listen
];

/**
 * Special hook to provide access to the 'nearest' EventBus instance.
 * From a custom hooke, developers can now easily access the
 *
 *  `notify(<event>)` and
 *  `listen(<event type>, handler)`
 *
 * features of the EventBus. This hook also manages component listeners
 * and !!auto-disconnects during dismounts.
 *
 * NOTE: this hook should ONLY be used under special circumstances such as Facade-to-Facade
 * communications, etc. The service should not be used for redux-like messagings (action dispatching).
 *
 * @returns [notifyFn, listenerFn]
 */
export const useEventBus = (
  context?: Context<DependencyInjector>
): HookResponse => {
  const injector = useContext(context || InjectorContext);
  const [eventBus] = useState<EventBus>(() => injector.get(EventBus));
  const [registry, setRegistry] = useState<Unsubscribe[]>([]);

  const notify = useCallback((e: EmitEvent<any>) => {
    eventBus.announce(e);
  }, []);
  const listen = useCallback(
    /**
     * Cache the unsubscribe AND trigger UI updates
     * since the listener is notified immediately and may
     * require UI re-renders.
     */
    (...args: ListenerArgs) => {
      const unsubscribe = eventBus.on.apply(eventBus, args);
      setRegistry((l) => [...l, unsubscribe]);
    },
    []
  );

  useEffect(() => {
    return () => {
      registry.map((unsubscribe) => unsubscribe());
    };
  }, []);

  return [notify, listen];
};
