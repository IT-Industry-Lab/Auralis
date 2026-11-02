'use client';

import { useState } from 'react';
import { Input } from '@/shared/ui/Input';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [disabledEmail, setDisabledEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [errorValue, setErrorValue] = useState('Epam@epam.com');
  const [fullWidthValue, setFullWidthValue] = useState('');

  return (
    <div>
      <Input
        label="Email"
        placeholder="Epam@epam.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Input
        type="search"
        aria-label="Search"
        placeholder="Input search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Input
        label="Email"
        error="Error text"
        value={errorValue}
        onChange={(event) => setErrorValue(event.target.value)}
      />
      <Input
        label="Email"
        placeholder="Epam@epam.com"
        disabled
        value={disabledEmail}
        onChange={(event) => setDisabledEmail(event.target.value)}
      />
      <Input
        label="Email"
        placeholder="Epam@epam.com"
        fullWidth
        value={fullWidthValue}
        onChange={(event) => setFullWidthValue(event.target.value)}
      />
    </div>
  );
}
