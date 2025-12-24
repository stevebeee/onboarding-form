import { ENDPOINTS } from '../constants/api';
import { SubmitPayload } from '../types/onboarding';

export const validateCorporationNumber = async (corpNumber: string): Promise<void> => {
  if (!corpNumber) {
    throw new Error('Corporation number is required');
  }

  if (corpNumber.length !== 9) {
    throw new Error('Corporation number must be 9 digits');
  }

  try {
    const response = await fetch(`${ENDPOINTS.VALIDATE_CORP_NUMBER}/${corpNumber}`);

    if (!response.ok) {
      throw new Error('Corporation number is invalid');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Corporation number is invalid')) {
      throw error;
    }
    throw new Error('Failed to validate corporation number');
  }
};

export const submitOnboardingForm = async (payload: SubmitPayload): Promise<void> => {
  try {
    const response = await fetch(ENDPOINTS.SUBMIT_PROFILE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Form submission failed');
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('An error occurred while submitting the form');
  }
};
