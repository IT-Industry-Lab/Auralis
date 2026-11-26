'use client'

import Link from 'next/link';
import styles from './Sidebar.module.scss';
import {
  SidebarItemProps,
  SidebarNavigationProps,
  SidebarProps,
} from './Sidebar.props';


export const Sidebar = ({ isDisabled=false, children, className='', ...rest }: SidebarProps) => {
  const sidebarClassName = `${styles['sidebar']} ${isDisabled ? styles['sidebar-disabled'] : ''} ${className}`

  return (
    <aside className={sidebarClassName} {...rest}>
      {children}
    </aside>
  );
};

const SidebarNavigation = ({
  children,
  ...rest
}: SidebarNavigationProps) => {
  return (
    <nav {...rest}>
      {children}
    </nav>
  );
};

export const SidebarItem = ({
  path,
  icon,
  isActive = false,
  isDisabled = false,
  onClick,
  children,
  className='',
  style = {},
}: SidebarItemProps) => {
  const itemClassName = `${styles['item']} ${ isActive ? styles['item-active'] : ''} ${isDisabled ? styles['item-disabled'] : ''} ${className}`
  const iconClassName = `${styles['icon']} ${isActive ? styles['icon-active'] : ''}`

  if (path) {
    return (
      <Link
        onClick={onClick}
        style={{ ...style }}
        href={path}
        className={itemClassName}
        prefetch={false}
      >
        <span className={iconClassName}>{icon}</span>
        <span className={styles['label']}>{children}</span>
      </Link>
    );
  }

 /* if (!path) {
    return (
      <div style={{ ...style }} className={itemClassName}>
        <span className={iconClassName}>{icon}</span>
        <span className={styles['label']}>{children}</span>
      </div>
    );
  }*/

  return (
    <button
      style={{ ...style }}
      className={itemClassName}
      disabled={isDisabled}
      type="button"
      onClick={onClick}
    >
      <span className={iconClassName}>{icon}</span>
      <span className={styles['label']}>{children}</span>
    </button>
  );
};


Sidebar.Navigation = SidebarNavigation;
Sidebar.Item = SidebarItem;
