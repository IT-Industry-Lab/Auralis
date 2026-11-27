'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Controller, useForm } from 'react-hook-form';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { RegisterApiError, useRegister } from '../api/register';
import { RECAPTCHA_SITE_KEY } from '../config/recaptcha';
import { toRegisterCredentials, type RegisterFormData } from '../model/types';
import { registerValidation } from '../model/validation';
import { EmailSentModal } from './EmailSentModal/EmailSentModal';
import s from './RegisterForm.module.css';
import google from './google.svg';
import github from './github.svg';

export const RegisterForm = () => {
  const { mutateAsync: register, isPending, error, reset: resetMutation } = useRegister();
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    resetMutation();

    try {
      await register(toRegisterCredentials(data));

      setSentEmail(data.email);
      reset();
    } catch (err) {
      if (err instanceof RegisterApiError && err.fieldError) {
        setError(err.fieldError.field, { message: err.fieldError.message });
      }
    }
  };

  return (
    <div className={s.registerForm}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <h1 className={s.registerFormTitle}>Sign Up</h1>

      <div className={s.oauth}>
        <button type="button" className={s.button} aria-label="Sign up with Google">
          <Image src={google} alt="" width={36} height={36} />
        </button>
        <button type="button" className={s.button} aria-label="Sign up with GitHub">
          <Image src={github} alt="" width={36} height={36} />
        </button>
      </div>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.inputBlock}>
          <div className={s.fieldWrapper}>
            <Controller
              name="username"
              control={control}
              rules={registerValidation.username}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Username"
                  placeholder="Epam11"
                  error={errors.username?.message}
                  fullWidth
                />
              )}
            />
          </div>

          <div className={s.fieldWrapper}>
            <Controller
              name="email"
              control={control}
              rules={registerValidation.email}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="Epam@epam.com"
                  error={errors.email?.message}
                  fullWidth
                />
              )}
            />
          </div>

          <div className={s.fieldWrapper}>
            <Controller
              name="password"
              control={control}
              rules={registerValidation.password}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  type="password"
                  placeholder="******************"
                  error={errors.password?.message}
                  fullWidth
                />
              )}
            />
          </div>

          <div className={s.fieldWrapper}>
            <Controller
              name="passwordConfirmation"
              control={control}
              rules={registerValidation.passwordConfirmation}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password confirmation"
                  type="password"
                  placeholder="******************"
                  error={errors.passwordConfirmation?.message}
                  fullWidth
                />
              )}
            />
          </div>
        </div>

        <div className={s.checkboxWrapper}>
          <Controller
            name="agreeToTerms"
            control={control}
            rules={registerValidation.agreeToTerms}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                label={
                  <>
                    I agree to the{' '}
                    <Link href={ROUTES.termsOfService} className={s.link}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href={ROUTES.privacyPolicy} className={s.link}>
                      Privacy Policy
                    </Link>
                  </>
                }
              />
            )}
          />
        </div>

        {error && (
          <p className={s['api-error']} role="alert">
            {error.message}
          </p>
        )}

        <Button type="submit" disabled={!isValid || isPending} fullWidth>
          Sign Up
        </Button>

        <p className={s.haveAccount}>Do you have an account?</p>

        <Button asChild variant="text" fullWidth>
          <Link href={ROUTES.signIn}>Sign In</Link>
        </Button>
      </form>

      <EmailSentModal
        isOpen={Boolean(sentEmail)}
        email={sentEmail ?? ''}
        onClose={() => setSentEmail(null)}
      />
    </div>
  );
};
