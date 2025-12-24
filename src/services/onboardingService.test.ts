import { validateCorporationNumber, submitOnboardingForm } from './onboardingService';
import { ENDPOINTS } from '../constants/api';
import { SubmitPayload } from '../types/onboarding';

global.fetch = jest.fn();

describe('onboardingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCorporationNumber', () => {
    it('should throw error when corporation number is empty', async () => {
      await expect(validateCorporationNumber('')).rejects.toThrow('Corporation number is required');
    });

    it('should throw error when corporation number is not 9 digits', async () => {
      await expect(validateCorporationNumber('12345')).rejects.toThrow(
        'Corporation number must be 9 digits',
      );
      await expect(validateCorporationNumber('1234567890')).rejects.toThrow(
        'Corporation number must be 9 digits',
      );
    });

    it('should call the correct endpoint with corporation number', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await validateCorporationNumber('123456789');

      expect(fetch).toHaveBeenCalledWith(`${ENDPOINTS.VALIDATE_CORP_NUMBER}/123456789`);
    });

    it('should throw error when API returns not ok response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(validateCorporationNumber('123456789')).rejects.toThrow(
        'Corporation number is invalid',
      );
    });

    it('should throw generic error when fetch fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(validateCorporationNumber('123456789')).rejects.toThrow(
        'Failed to validate corporation number',
      );
    });

    it('should successfully validate when API returns ok response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await expect(validateCorporationNumber('123456789')).resolves.toBeUndefined();
    });
  });

  describe('submitOnboardingForm', () => {
    const mockPayload: SubmitPayload = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      corporationNumber: '123456789',
    };

    it('should call the correct endpoint with POST method', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await submitOnboardingForm(mockPayload);

      expect(fetch).toHaveBeenCalledWith(ENDPOINTS.SUBMIT_PROFILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockPayload),
      });
    });

    it('should successfully submit form when API returns ok response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await expect(submitOnboardingForm(mockPayload)).resolves.toBeUndefined();
    });

    it('should throw error with custom message when API returns error', async () => {
      const errorMessage = 'Invalid data provided';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
      });

      await expect(submitOnboardingForm(mockPayload)).rejects.toThrow(errorMessage);
    });

    it('should throw default error when API returns error without message', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      await expect(submitOnboardingForm(mockPayload)).rejects.toThrow('Form submission failed');
    });

    it('should throw generic error when fetch fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(submitOnboardingForm(mockPayload)).rejects.toThrow('Network error');
    });

    it('should throw generic error when non-Error is thrown', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce('Unknown error');

      await expect(submitOnboardingForm(mockPayload)).rejects.toThrow(
        'An error occurred while submitting the form',
      );
    });
  });
});
