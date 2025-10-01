import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';

describe('Select', () => {
  it('opens and selects an option', () => {
    const onChange = vi.fn();
    render(
      <Select
        value="A"
        onChange={onChange}
        options={[{ value: 'A', label: 'Alpha' }, { value: 'B', label: 'Beta' }]}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: /Beta/i }));
    expect(onChange).toHaveBeenCalledWith('B');
  });
});

