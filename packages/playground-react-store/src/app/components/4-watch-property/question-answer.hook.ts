import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

import { QAViewModel } from './question-answer.interfaces';
import { callWtfApi, WTF } from './wtf.service';

export function useQa(): QAViewModel {
  const [question, updateQuestion] = useState('');
  const [answer, updateAnswer] = useState('');

  const verify = useCallback(
    debounce(async (newQuestion: string) => {
      updateAnswer(WTF.wait);
      if (newQuestion.indexOf('?') > -1) {
        try {
          const newAnswer = await callWtfApi();
          updateAnswer(newAnswer);

          return;
        } catch (error) {
          updateAnswer(`${WTF.error}: ${error}`);
        }
      }

      updateAnswer(WTF.hint);
    }, 200),
    [updateAnswer]
  );

  useEffect(() => {
    verify(question);
  }, [verify, question]);

  return [question, answer, updateQuestion];
}
