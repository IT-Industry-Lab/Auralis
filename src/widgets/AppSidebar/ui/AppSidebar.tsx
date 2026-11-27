'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { linksData } from '../model';
import styles from './AppSidebar.module.scss';
import { LogOutOutline } from '@/assets/icons';
import { Sidebar } from '@/shared/ui/Sidebar';
import { ROUTES } from '@/shared/constants';
import { AppSidebarProps } from './AppSidebar.props';
import { LogoutDialog, useGetMeQuery } from '@/features/auth';

const EACH_ELEMENT_NUMBER = 6;

export const AppSidebar = ({ isDisabled, ...rest }: AppSidebarProps) => {
  const { data: user } = useGetMeQuery();
  const pathname = usePathname();
  const [isLogoutOpen, setLogoutOpen] = useState(false);

  const sidebarItemsMapped = linksData.map(({ id, title, path, icon, iconActive }, i) => {
    const resolvedPath = path === '/profile' ? (user?.id ? ROUTES.profile : ROUTES.signIn) : path;
    const isActive =
      pathname === resolvedPath ||
      (resolvedPath !== '/' && pathname.startsWith(resolvedPath + '/'));

    return (
      <Sidebar.Item
        isDisabled={isDisabled}
        key={id}
        path={resolvedPath}
        icon={isActive ? iconActive || icon : icon}
        isActive={isActive}
        style={{ marginTop: (i + 1) % EACH_ELEMENT_NUMBER === 0 ? 60 : 0 }}
      >
        {title}
      </Sidebar.Item>
    );
  });

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
      }}
    >
      <Sidebar isDisabled={isDisabled} {...rest}>
        <Sidebar.Navigation>
          <div className={styles['wrapper']}>{sidebarItemsMapped}</div>
        </Sidebar.Navigation>
        {user && (
          <div className={styles['logout-section']}>
            <div className={styles['wrapper']}>
              <Sidebar.Item
                className={`${styles['logout-item']}`}
                icon={<LogOutOutline stroke="currentColor" />}
                onClick={() => setLogoutOpen(true)}
              >
                Log Out
              </Sidebar.Item>
            </div>
          </div>
        )}
      </Sidebar>
      {user && (
        <LogoutDialog
          email={user.email}
          isOpen={isLogoutOpen}
          onClose={() => setLogoutOpen(false)}
        />
      )}
    </div>
  );
};
