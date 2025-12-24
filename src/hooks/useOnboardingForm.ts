import { useState } from 'react';
import { FormInstance } from 'antd';
import { message } from 'antd';
import { submitOnboardingForm, validateCorporationNumber } from '../services/onboardingService';
import { OnboardingFormValues, SubmitPayload } from '../types/onboarding';

export const useOnboardingForm = (form: FormInstance) => {
  const [loading, setLoading] = useState(false);

  const validateCorpNumber = async (_: any, value: string) => {
    try {
      await validateCorporationNumber(value);
    } catch (error) {
      return Promise.reject(error instanceof Error ? error.message : 'Validation failed');
    }
  };

  const onFinish = async (values: OnboardingFormValues) => {
    setLoading(true);
    try {
      const payload: SubmitPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phoneNumber,
        corporationNumber: values.corpNumber,
      };

      await submitOnboardingForm(payload);
      message.success('Form submitted successfully!');
      form.resetFields();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while submitting the form';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    validateCorpNumber,
    onFinish,
  };
};
