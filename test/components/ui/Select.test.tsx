import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/ui/Select';

describe('Select', () => {
  it('should render with options', () => {
    render(
      <Select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '2');
    
    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue('2');
  });

  it('should apply custom className', () => {
    render(<Select className="custom-class"><option>Test</option></Select>);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select disabled><option>Test</option></Select>);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});

