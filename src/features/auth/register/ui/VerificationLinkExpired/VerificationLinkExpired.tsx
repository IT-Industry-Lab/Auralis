'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Controller, useForm, type RegisterOptions } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { EmailSentModal } from '../EmailSentModal/EmailSentModal';
import verificationLinkExpiredIllustration from './verification-link-expired.svg';
import s from './VerificationLinkExpired.module.css';

type VerificationLinkExpiredFormData = {
  email: string;
};

const emailValidation: RegisterOptions<VerificationLinkExpiredFormData, 'email'> = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'The email must match the format example@example.com',
  },
};

export const VerificationLinkExpired = () => {
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<VerificationLinkExpiredFormData>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: VerificationLinkExpiredFormData) => {
    setSentEmail(data.email);
    reset();
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Email verification link expired</h1>
      <p className={s.description}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={emailValidation}
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

        <Button type="submit" disabled={!isValid} fullWidth className={s.submitButton}>
          Resend verification link
        </Button>
      </form>

      <Image
        src={verificationLinkExpiredIllustration}
        alt="Email verification link expired"
        width={473}
        height={352}
        className={s.illustration}
        priority
      />

      <EmailSentModal
        isOpen={Boolean(sentEmail)}
        email={sentEmail ?? ''}
        onClose={() => setSentEmail(null)}
      />
    </div>
  );
};
