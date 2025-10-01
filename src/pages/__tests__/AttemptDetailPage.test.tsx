import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AttemptDetailPage from '../AttemptDetailPage';

vi.mock('../../services/QuizService', () => ({
  __esModule: true,
  default: { attemptDetail: vi.fn(async () => ({ attemptId: 'a1', score: 3, total: 5, submitted: true, feedback: [
    { questionId: 'q1', text: 'Question 1', category: 'Cat', options: [], selectedKey: 'A', correctKey: 'B', isCorrect: false },
  ] })) },
}));

describe('AttemptDetailPage', () => {
  it('renders wrong answers list', async () => {
    render(
      <MemoryRouter initialEntries={["/history/a1"]}>
        <Routes>
          <Route path="/history/:attemptId" element={<AttemptDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Wrong Answers/i)).toBeInTheDocument();
    expect(await screen.findByText(/Question 1/i)).toBeInTheDocument();
  });
});

