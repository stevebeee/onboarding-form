import { renderHook, act, waitFor } from '@testing-library/react';
import { message } from 'antd';
import { useOnboardingForm } from './useOnboardingForm';
import { submitOnboardingForm, validateCorporationNumber } from '../services/onboardingService';

jest.mock('../services/onboardingService');
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useOnboardingForm', () => {
  const mockForm = {
    resetFields: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCorpNumber', () => {
    it('should resolve when validation succeeds', async () => {
      (validateCorporationNumber as jest.Mock).mockResolvedValue(true);
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      await expect(result.current.validateCorpNumber({}, '12345')).resolves.toBeUndefined();
    });

    it('should reject with error message when validation fails', async () => {
      const errorMessage = 'Invalid corporation number';
      (validateCorporationNumber as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      await expect(result.current.validateCorpNumber({}, '12345')).rejects.toBe(errorMessage);
    });

    it('should reject with default message when error is not an Error instance', async () => {
      (validateCorporationNumber as jest.Mock).mockRejectedValue('string error');
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      await expect(result.current.validateCorpNumber({}, '12345')).rejects.toBe(
        'Validation failed',
      );
    });
  });

  describe('onFinish', () => {
    const mockFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      corpNumber: '12345',
    };

    it('should submit form successfully and reset fields', async () => {
      (submitOnboardingForm as jest.Mock).mockResolvedValue({});
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      await act(async () => {
        await result.current.onFinish(mockFormValues);
      });

      expect(submitOnboardingForm).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        corporationNumber: '12345',
      });
      expect(message.success).toHaveBeenCalledWith('Form submitted successfully!');
      expect(mockForm.resetFields).toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });

    it('should set loading state during submission', async () => {
      (submitOnboardingForm as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      act(() => {
        result.current.onFinish(mockFormValues);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle submission error with Error instance', async () => {
      const errorMessage = 'Submission failed';
      (submitOnboardingForm as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      await act(async () => {
        await result.current.onFinish(mockFormValues);
      });

      expect(message.error).toHaveBeenCalledWith(errorMessage);
      expect(mockForm.resetFields).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });

    it('should handle submission error with default message', async () => {
      (submitOnboardingForm as jest.Mock).mockRejectedValue('unknown error');
      const { result } = renderHook(() => useOnboardingForm(mockForm));

      await act(async () => {
        await result.current.onFinish(mockFormValues);
      });

      expect(message.error).toHaveBeenCalledWith('An error occurred while submitting the form');
      expect(mockForm.resetFields).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should initialize with loading false', () => {
      const { result } = renderHook(() => useOnboardingForm(mockForm));
      expect(result.current.loading).toBe(false);
    });
  });
});
