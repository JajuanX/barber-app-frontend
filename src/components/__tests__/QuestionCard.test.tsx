import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '../QuestionCard';

describe('QuestionCard', () => {
  const question = {
    _id: 'q1',
    category: 'Safety',
    text: 'If a client has head lice, the barber…',
    options: [
      { key: 'A', text: 'can proceed with the service.' },
      { key: 'B', text: 'must refer the client to a physician.' },
      { key: 'C', text: 'must shampoo the hair.' },
      { key: 'D', text: 'should refer the client to a pharmacist.' },
    ],
  };

  it('renders and selects option', () => {
    const onSelect = vi.fn();
    render(<QuestionCard question={question} selectedKey={undefined} onSelect={onSelect} index={0} total={50} />);
    const optionB = screen.getByLabelText(/B\./i);
    fireEvent.click(optionB);
    expect(onSelect).toHaveBeenCalled();
  });
});

