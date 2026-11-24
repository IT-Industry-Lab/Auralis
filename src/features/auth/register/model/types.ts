export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  agreeToTerms: boolean;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

export const toRegisterCredentials = ({
  username,
  email,
  password,
  passwordConfirmation,
  agreeToTerms,
}: RegisterFormData): RegisterCredentials => ({
  username,
  email,
  password,
  passwordConfirmation,
  acceptedTerms: agreeToTerms,
});
