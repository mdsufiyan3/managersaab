import {
  RiHomeLine,
  RiTBoxLine,
  RiHistoryLine,
  RiTruckLine,
} from 'react-icons/ri';

export const sidebarNavigation = [
  { icon: RiHomeLine, label: 'Home', href: '/home' },
  { icon: RiTBoxLine, label: 'Dashboard', href: '/dashboard' },
  { icon: RiTBoxLine, label: 'Products', href: '/product' },
  { icon: RiTruckLine, label: 'Orders', href: '/order' },
  { icon: RiHistoryLine, label: 'Payment History', href: '/payment' },
];

export const isActiveRoute = (currentPath: string, href: string) => {
  return currentPath === href.replace('/', '') ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white';
};
