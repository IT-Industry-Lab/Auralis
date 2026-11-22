'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useLogin } from '../api/login';
import googleIcon from './assets/google.svg';
import githubIcon from './assets/github.svg';
import styles from './SignInForm.module.css';

const formErrors = {
  'unverified-email': 'Please verify your email before logging in.',
  'invalid-request': 'Check your email and password and try again.',
  unavailable: 'Sign-in is temporarily unavailable. Please try again later.',
  'network-error': 'Could not reach the sign-in service. Please try again.',
};

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, error, isPending, isSuccess, reset } = useLogin();
  const credentialsError = error?.code === 'invalid-credentials';
  const formError =
    error && error.code !== 'invalid-credentials' ? formErrors[error.code] : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.querySelector<HTMLInputElement>('input:invalid')?.focus();
      return;
    }
    login({ email: email.trim(), password });
  }

  return (
    <form
      className={styles.card}
      aria-labelledby="sign-in-title"
      aria-busy={isPending}
      onSubmit={handleSubmit}
      noValidate
    >
      <h1 className={styles.title} id="sign-in-title">
        Sign In
      </h1>
      <div className={styles.providers}>
        <Image src={googleIcon} alt="Google" width={36} height={36} />
        <Image src={githubIcon} alt="GitHub" width={36} height={36} />
      </div>
      <div className={styles.fields} aria-live="polite">
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Epam@epam.com"
          autoComplete="username"
          required
          fullWidth
          disabled={isPending}
          value={email}
          error={emailError}
          onInvalid={(event) =>
            setEmailError(
              event.currentTarget.validity.valueMissing
                ? 'Enter your email.'
                : 'Enter a valid email address.'
            )
          }
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError('');
            reset();
          }}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="**********"
          autoComplete="current-password"
          required
          minLength={8}
          maxLength={128}
          fullWidth
          disabled={isPending}
          value={password}
          error={
            passwordError ||
            (credentialsError ? 'The email or password are incorrect. Try again please' : undefined)
          }
          onInvalid={(event) =>
            setPasswordError(
              event.currentTarget.validity.valueMissing
                ? 'Enter your password.'
                : 'Password must contain at least 8 characters.'
            )
          }
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError('');
            reset();
          }}
        />
      </div>
      <span className={styles.recovery} role="link" aria-disabled="true">
        Forgot Password
      </span>
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign In'}
      </Button>
      {formError && (
        <p className={styles['form-error']} role="alert">
          {formError}
        </p>
      )}
      {isSuccess && (
        <p className={styles.notice} role="status">
          Signed in successfully.
        </p>
      )}
      <p className={styles.prompt}>Don’t have an account?</p>
      <Link className={styles.register} href="/register">
        Sign Up
      </Link>
    </form>
  );
}
