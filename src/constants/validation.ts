export const NAME_RULES = [
  { required: true, message: '{0} is required' },
  {
    pattern: /^[a-zA-Z]{1,50}$/,
    message: '{0} must only contain letters (max 50)',
  },
];

export const PHONE_RULES = [
  { required: true, message: 'Phone number is required' },
  {
    pattern: /^\+1[0-9]{10}$/,
    message: 'Phone number must be in the format +1XXXXXXXXXX',
  },
];

export const CORP_NUMBER_RULES = [{ required: true, message: 'Corporation number is required' }];
