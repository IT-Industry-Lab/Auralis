const messages = {
  email: {
    required: 'Enter your email.',
    invalid: 'The email must match the format example@example.com',
  },
  password: {
    required: 'Enter your password.',
    invalid: 'Password must contain at least 8 characters.',
  },
};

export function getLoginFieldError(
  field: keyof typeof messages,
  validity: Pick<ValidityState, 'valid' | 'valueMissing' | 'tooLong'>
): string {
  if (validity.valid) return '';
  if (field === 'password' && validity.tooLong)
    return 'Password must contain at most 128 characters.';
  return validity.valueMissing ? messages[field].required : messages[field].invalid;
}
