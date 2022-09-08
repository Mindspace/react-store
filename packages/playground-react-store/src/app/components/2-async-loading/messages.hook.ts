import { useState, useCallback } from 'react';

import { EmailService } from './messages.service';
import { MessagesState } from './messages.interfaces';

/**********************************************
 *  Traditional Hook Solution:
 *  Demonstrate the use of Reactive store 'async mutators'
 **********************************************/

export function useMessages(): MessagesState {
  const [service] = useState(() => new EmailService());
  const [messages, setMessages] = useState([] as string[]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeToReady, setTimeToReady] = useState(0);

  const startCountdown = useCallback(() => {
    setTimeToReady(3);
    const countDown = setInterval(() => {
      setTimeToReady((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countDown);
  }, [setTimeToReady]);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    const stopCountdown = startCountdown();
    const newMessages = await service.loadAll();

    setMessages(newMessages);
    setIsLoading(false);
    stopCountdown();
    setTimeToReady(3);
  }, [service, setIsLoading, startCountdown, setMessages]);

  return {
    isLoading,
    timeToReady,
    messages,
    refresh,
  };
}
