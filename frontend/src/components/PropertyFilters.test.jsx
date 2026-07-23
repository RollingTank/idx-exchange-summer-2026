import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters Component', () => {
  
  test('renders all 6 input fields and action buttons', () => {
    render(<PropertyFilters onSearch={jest.fn()} onClear={jest.fn()} />);

    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  test('submits only active filters when searching', async () => {
    const handleSearchMock = jest.fn();

    render(<PropertyFilters onSearch={handleSearchMock} onClear={jest.fn()} />);

    // Type into City and select 2+ Beds, leaving other fields empty
    await userEvent.type(screen.getByPlaceholderText('City'), 'Beverly Hills');
    await userEvent.selectOptions(screen.getAllByRole('combobox')[0], '2');

    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(handleSearchMock).toHaveBeenCalledTimes(1);
    expect(handleSearchMock).toHaveBeenCalledWith({
      city: 'Beverly Hills',
      beds: '2'
    });
  });

  test('resets all form inputs and calls onClear when Clear button is clicked', async () => {
    const handleClearMock = jest.fn();

    render(<PropertyFilters onSearch={jest.fn()} onClear={handleClearMock} />);

    const cityInput = screen.getByPlaceholderText('City');

    await userEvent.type(cityInput, 'Alameda');
    expect(cityInput).toHaveValue('Alameda');

    // Click Clear Filters
    await userEvent.click(screen.getByRole('button', { name: /clear filters/i }));

    // Input should be empty and onClear called
    expect(cityInput).toHaveValue('');
    expect(handleClearMock).toHaveBeenCalledTimes(1);
  });

});
