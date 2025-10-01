import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminQuestionsPage } from '../AdminQuestionsPage';
import { AuthProvider } from '../../context/AuthContext';

vi.mock('../../services/QuestionService', () => ({
  __esModule: true,
  default: {
    list: vi.fn(async () => []),
    create: vi.fn(async () => ({})),
    remove: vi.fn(async () => ({}))
  }
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Minimal AuthProvider stub: we can’t easily set user via context without exposing setter, so we inject a simple provider
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('AdminQuestionsPage', () => {
  it('renders form fields', () => {
    // We’ll bypass role check by mocking useAuth inside component
    vi.doMock('../../context/AuthContext', async () => {
      const mod = await vi.importActual<any>('../../context/AuthContext');
      return { ...mod, useAuth: () => ({ user: { role: 'admin', name: 'A', email: 'a@b.c', _id: '1' } }) };
    });
    const { AdminQuestionsPage: Page } = require('../AdminQuestionsPage');
    render(<Wrapper><Page /></Wrapper>);
    expect(screen.getByText(/Manage Questions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Option A'), { target: { value: 'Choice A' } });
  });
});

