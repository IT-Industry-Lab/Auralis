import type { RegisterOptions } from 'react-hook-form';
import type { RegisterFormData } from './types';

const formValidation = {
  maxUserNameLength: 30,
  minUserNameLength: 6,
  maxPasswordLength: 20,
  minPasswordLength: 6,
  usernameRegex: /^[0-9A-Za-z_-]+$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passwordRegex:
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/,
};

export const registerValidation: {
  [K in keyof RegisterFormData]: RegisterOptions<RegisterFormData, K>;
} = {
  username: {
    required: 'Username is required',
    minLength: {
      value: formValidation.minUserNameLength,
      message: 'Minimum number of characters 6',
    },
    maxLength: {
      value: formValidation.maxUserNameLength,
      message: 'Maximum number of characters 30',
    },
    pattern: {
      value: formValidation.usernameRegex,
      message: 'Username can only contain 0-9, A-Z, a-z, _, -',
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: formValidation.emailRegex,
      message: 'The email must match the format example@example.com',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: formValidation.minPasswordLength,
      message: 'Minimum number of characters 6',
    },
    maxLength: {
      value: formValidation.maxPasswordLength,
      message: 'Maximum number of characters 20',
    },
    pattern: {
      value: formValidation.passwordRegex,
      message:
        'Password must contain 0-9, a-z, A-Z and at least one special character: ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~',
    },
  },
  passwordConfirmation: {
    required: 'Password confirmation is required',
    validate: (value, formValues) => value === formValues.password || 'Passwords must match',
  },
  agreeToTerms: {
    required: true,
  },
};
