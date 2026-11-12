import type { ReactNode } from 'react';
import {
  Bookmark,
  BookmarkOutline,
  Home,
  HomeOutline,
  MessageCircle,
  MessageCircleOutline,
  Person,
  PersonOutline,
  PlusSquare,
  PlusSquareOutline,
  Search,
  TrendingUp,
} from '@/assets/icons';

type NavItem = {
  id: number;
  title: string;
  path: string;
  icon: ReactNode;
  iconActive?: ReactNode;
};

export const linksData: NavItem[] = [
  {
    id: 1,
    title: 'Feed',
    path: '/',

    icon: <HomeOutline />,
    iconActive: <Home />,
  },
  {
    id: 2,
    title: 'Create',
    path: '/create',
    icon: <PlusSquareOutline  />,
    iconActive: <PlusSquare  />,
  },
  {
    id: 3,
    title: 'Profile',
    path: '/profile',
    icon: <PersonOutline  />,
    iconActive: <Person  />,
  },
  {
    id: 4,
    title: 'Messenger',
    path: '/messenger',
    icon: <MessageCircleOutline  />,
    iconActive: <MessageCircle  />,
  },
  {
    id: 5,
    title: 'Search',
    path: '/search',
    icon: <Search  />,
    // iconActive: <Search  />,
  },
  {
    id: 6,
    title: 'Statistics',
    path: '/statistics',
    icon: <TrendingUp  />,
    // iconActive: <TrendingUp  />,
  },
  {
    id: 7,
    title: 'Favorites',
    path: '/favorites',
    icon: <BookmarkOutline  />,
    iconActive: <Bookmark  />,
  },
];
