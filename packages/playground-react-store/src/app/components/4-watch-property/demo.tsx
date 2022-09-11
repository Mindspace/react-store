import React from 'react';

import { useStore } from './question-answer.store';

/**
 * Show list of messages that container the searchCriteria
 */
export const QuestionAnswer: React.FC = () => {
  const { question, answer, updateQuestion } = useStore(); //selectViewModel);

  return (
    <div className="sampleBox">
      <p>
        Ask a yes/no question:
        <input value={question} onChange={(e) => updateQuestion(e.target.value)} />
      </p>
      <p>{answer}</p>
    </div>
  );
};
