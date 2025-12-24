import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingForm from './OnboardingForm';
import '@testing-library/jest-dom';

describe('OnboardingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('renders the form with all fields', () => {
    render(<OnboardingForm />);
    expect(screen.getByText('Onboarding Form')).toBeInTheDocument();
    expect(screen.getByTestId('firstName')).toBeInTheDocument();
    expect(screen.getByTestId('lastName')).toBeInTheDocument();
    expect(screen.getByTestId('phoneNumber')).toBeInTheDocument();
    expect(screen.getByTestId('corpNumber')).toBeInTheDocument();
  });

  test('submits the form successfully with valid data', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<OnboardingForm />);

    fireEvent.change(screen.getByTestId('firstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('lastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('phoneNumber'), { target: { value: '+11234567890' } });
    fireEvent.change(screen.getByTestId('corpNumber'), { target: { value: '123456789' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fe-hometask-api.qa.vault.tryvault.com/profile-details',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });
  });
});
