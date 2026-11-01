'use client';

import { CustomTabs, TabContent } from './CustomTabs';

const tabs = [
  {
    value: 'account',
    label: 'Account',
    icon: <span aria-hidden="true">👤</span>,
  },
  {
    value: 'password',
    label: 'Password',
    icon: <span aria-hidden="true">🔒</span>,
  },
  {
    value: 'settings',
    label: 'Settings',
    disabled: true,
  },
];

export function TestCustomTabs() {
  return (
    <CustomTabs defaultValue="account" tabs={tabs}>
      <TabContent value="account">
        <h3>Account Settings</h3>
        <p>Make changes to your account here.</p>
      </TabContent>

      <TabContent value="password">
        <h3>Password Settings</h3>
        <p>Change your password here.</p>
      </TabContent>

      <TabContent value="settings">
        <h3>Settings</h3>
        <p>This tab is disabled for now.</p>
      </TabContent>
    </CustomTabs>
  );
}
