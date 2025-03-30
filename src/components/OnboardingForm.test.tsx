import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingForm from './OnboardingForm.tsx';
import '@testing-library/jest-dom';
import React from 'react';

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays validation errors when fields are invalid', async () => {
    render(<OnboardingForm />);

    // Trigger blur events on inputs with invalid values
    fireEvent.blur(screen.getByTestId('firstName'), { target: { value: '123' } });
    fireEvent.blur(screen.getByTestId('lastName'), { target: { value: '' } });
    fireEvent.blur(screen.getByTestId('phoneNumber'), { target: { value: '123456' } });
    fireEvent.blur(screen.getByTestId('corpNumber'), { target: { value: '123' } });

    // Check for validation error messages
    expect(await screen.findByText('First Name must only contain 50 or less letters')).toBeInTheDocument();
    expect(await screen.findByText('Last Name must only contain 50 or less letters')).toBeInTheDocument();
    expect(await screen.findByText('Phone number must be in the format +1XXXXXXXXXX')).toBeInTheDocument();
    expect(await screen.findByText('Corporation number is invalid')).toBeInTheDocument();
  });

  test('does not display errors for valid inputs', async () => {
    render(<OnboardingForm />);

    // Trigger blur events on inputs with valid values
    fireEvent.blur(screen.getByTestId('firstName'), { target: { value: 'John' } });
    fireEvent.blur(screen.getByTestId('lastName'), { target: { value: 'Doe' } });
    fireEvent.blur(screen.getByTestId('phoneNumber'), { target: { value: '+11234567890' } });
    fireEvent.blur(screen.getByTestId('corpNumber'), { target: { value: '123456789' } });

    // Ensure no error messages are displayed
    await waitFor(() => {
      expect(screen.queryByText('First Name must only contain 50 or less letters')).not.toBeInTheDocument();
      expect(screen.queryByText('Last Name must only contain 50 or less letters')).not.toBeInTheDocument();
      expect(screen.queryByText('Phone number must be in the format +1XXXXXXXXXX')).not.toBeInTheDocument();
      expect(screen.queryByText('Corporation number is invalid')).not.toBeInTheDocument();
    });
  });

  test('submits the form successfully when all fields are valid', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<OnboardingForm />);

    // Fill out the form with valid values
    fireEvent.blur(screen.getByTestId('firstName'), { target: { value: 'John' } });
    fireEvent.blur(screen.getByTestId('lastName'), { target: { value: 'Doe' } });
    fireEvent.blur(screen.getByTestId('phoneNumber'), { target: { value: '+11234567890' } });
    fireEvent.blur(screen.getByTestId('corpNumber'), { target: { value: '123456789' } });

    // Click the submit button
    fireEvent.click(screen.getByText('Submit'));

     // Ensure fetch was called with the correct data
     await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fe-hometask-api.qa.vault.tryvault.com/profile-details',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: 'John',
            lastName: 'Doe',
            phone: '+11234567890',
            corporationNumber: '123456789',
          }),
        }
      );
    });
  });

  test('displays an error message when form submission fails', async () => {
    // Mock the fetch API to simulate a failed submission
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Submission failed' }),
    });

    render(<OnboardingForm />);

    // Fill out the form with valid values
    fireEvent.blur(screen.getByTestId('firstName'), { target: { value: 'John' } });
    fireEvent.blur(screen.getByTestId('lastName'), { target: { value: 'Doe' } });
    fireEvent.blur(screen.getByTestId('phoneNumber'), { target: { value: '+11234567890' } });
    fireEvent.blur(screen.getByTestId('corpNumber'), { target: { value: '123456789' } });

    // Click the submit button
    fireEvent.click(screen.getByText('Submit'));

    // Ensure the error message is displayed
    expect(await screen.findByText('Submission failed')).toBeInTheDocument();
  });
});