'use client';

import dynamic from 'next/dynamic';

const SignInForm = dynamic(() => import('@/features/auth').then((auth) => auth.SignInForm), {
  ssr: false,
});

export default function LoginPage() {
  return <SignInForm />;
}
