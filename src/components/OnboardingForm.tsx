import React, { useState } from 'react';
import { Button, Input } from 'antd';

// OnboardingForm component handles user input, validation, and form submission
const OnboardingForm = () => {
  // State variables to store form field values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [corpNumber, setCorpNumber] = useState('');

  // State to track validation errors for each field
  const [errorState, setErrorState] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    corpNumber: '',
    formError: '', // General form submission error
  });

  // Validates the first name field
  const validateFirstName = (value: string) => {
    setFirstName(value);
    const nameRegex = /^[a-zA-Z]{1,50}$/; // Allows only letters, max length 50

    if (!nameRegex.test(value)) {
      setErrorState({ ...errorState, firstName: 'First Name must only contain 50 or less letters' });
    } else {
      setErrorState({ ...errorState, firstName: '' });
    }
  };

  // Validates the last name field
  const validateLastName = (value: string) => {
    setLastName(value);
    const nameRegex = /^[a-zA-Z]{1,50}$/; // Same validation as first name

    if (!nameRegex.test(value)) {
      setErrorState({ ...errorState, lastName: 'Last Name must only contain 50 or less letters' });
    } else {
      setErrorState({ ...errorState, lastName: '' });
    }
  };

  // Validates the phone number field
  const validatePhoneNumber = (value: string) => {
    setPhoneNumber(value);
    const phoneRegex = /^\+1[0-9]{10}$/; // Ensures phone number matches +1XXXXXXXXXX format

    if (!phoneRegex.test(value)) {
      setErrorState({ ...errorState, phoneNumber: 'Phone number must be in the format +1XXXXXXXXXX' });
    } else {
      setErrorState({ ...errorState, phoneNumber: '' });
    }
  };

  // Validates the corporation number field by checking its length and making an API call
  const validateCorpNumber = async (value: string) => {
    setCorpNumber(value);

    if (value?.length === 9) { // Corporation number must be exactly 9 characters
      try {
        const response = await fetch(`https://fehometask-api.qa.vault.tryvault.com/corporation-number/${value}`);
        if (!response.ok) {
          throw new Error('Corporation number is invalid');
        }
        setErrorState({ ...errorState, corpNumber: '' });
      } catch (error) {
        setErrorState({ ...errorState, corpNumber: 'Corporation number is invalid' });
      }
    } else {
      setErrorState({ ...errorState, corpNumber: 'Corporation number is invalid' });
    }
  };

  // Handles form submission by validating all fields and sending data to the API
  const submitForm = async () => {
    const newErrorState = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      corpNumber: '',
      formError: '',
    };

    // Validate each field and update error state
    if (!/^[a-zA-Z]{1,50}$/.test(firstName)) {
      newErrorState.firstName = 'First Name must only contain 50 or less letters';
    }

    if (!/^[a-zA-Z]{1,50}$/.test(lastName)) {
      newErrorState.lastName = 'Last Name must only contain 50 or less letters';
    }

    if (!/^\+1[0-9]{10}$/.test(phoneNumber)) {
      newErrorState.phoneNumber = 'Phone number must be in the format +1XXXXXXXXXX';
    }

    if (!corpNumber || corpNumber.length !== 9) {
      newErrorState.corpNumber = 'Corporation number is invalid';
    }

    setErrorState(newErrorState);

    // Check if there are any validation errors
    const hasErrors = Object.values(newErrorState).some(error => error !== '');

    if (!hasErrors) {
      try {
        // Submit form data to the API
        const response = await fetch('https://fe-hometask-api.qa.vault.tryvault.com/profile-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone: phoneNumber,
            corporationNumber: corpNumber,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'An error occurred while submitting the form');
        }
      } catch (error) {
        setErrorState({ ...errorState, formError: error.message });
      }
    }
  };

  return (
    <div className="formContainer">
      <h1>Onboarding Form</h1>

      {/* First Name Input */}
      <div className="nameInputRow">
        <div className="nameInputContainer">
          <label>First Name</label>
          <Input
            data-testid="firstName"
            status={errorState.firstName && 'error'}
            className="formInput"
            onBlur={e => validateFirstName(e.target.value)}
          />
          <span className="errorMessage">{errorState.firstName}</span>
        </div>

        {/* Last Name Input */}
        <div className="nameInputContainer">
          <label>Last Name</label>
          <Input
            data-testid="lastName"
            status={errorState.lastName && 'error'}
            className="formInput"
            onBlur={e => validateLastName(e.target.value)}
          />
          <span className="errorMessage">{errorState.lastName}</span>
        </div>
      </div>

      {/* Phone Number Input */}
      <label>Phone Number</label>
      <Input
        data-testid="phoneNumber"
        defaultValue={'+1'}
        status={errorState.phoneNumber && 'error'}
        className="formInput"
        onBlur={e => validatePhoneNumber(e.target.value)}
      />
      <span className="errorMessage">{errorState.phoneNumber}</span>

      {/* Corporation Number Input */}
      <label>Corporation Number</label>
      <Input
        data-testid="corpNumber"
        status={errorState.corpNumber && 'error'}
        className="formInput"
        type="number"
        onBlur={e => validateCorpNumber(e.target.value)}
      />
      <span className="errorMessage">{errorState.corpNumber}</span>

      {/* General Form Error */}
      <p className="errorMessage">{errorState.formError}</p>

      {/* Submit Button */}
      <Button className="submitBtn" type="primary" onClick={submitForm}>
        Submit
      </Button>
    </div>
  );
};

export default OnboardingForm;