import React, { createContext, useContext, useMemo, useState } from 'react';
import quizService, { QuestionDTO, GradeResultDTO } from '../services/QuizService';

type QuizState = {
  loading: boolean;
  attemptId?: string;
  questions: QuestionDTO[];
  currentIndex: number;
  answers: Record<string, string>; // questionId -> selectedKey
  result?: GradeResultDTO;
};

type QuizContextValue = QuizState & {
  start: (category?: string) => Promise<void>;
  select: (questionId: string, key: string) => void;
  next: () => void;
  prev: () => void;
  submit: () => Promise<void>;
  reset: () => void;
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QuizState>({ loading: false, questions: [], currentIndex: 0, answers: {} });

  const start = async (category?: string) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await quizService.startQuiz(category);
      setState({ loading: false, attemptId: data.attemptId, questions: data.questions, currentIndex: 0, answers: {} });
    } catch (e) {
      setState((s) => ({ ...s, loading: false }));
      throw e;
    }
  };

  const select = (questionId: string, key: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: key } }));
  };

  const next = () => setState((s) => ({ ...s, currentIndex: Math.min(s.currentIndex + 1, s.questions.length - 1) }));
  const prev = () => setState((s) => ({ ...s, currentIndex: Math.max(s.currentIndex - 1, 0) }));

  const submit = async () => {
    if (!state.attemptId) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const answersArray = Object.entries(state.answers).map(([questionId, selectedKey]) => ({ questionId, selectedKey }));
      const result = await quizService.submitQuiz(state.attemptId, answersArray);
      setState((s) => ({ ...s, loading: false, result }));
    } catch (e) {
      setState((s) => ({ ...s, loading: false }));
      throw e;
    }
  };

  const reset = () => setState({ loading: false, questions: [], currentIndex: 0, answers: {} });

  const value = useMemo(
    () => ({ ...state, start, select, next, prev, submit, reset }),
    [state]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
