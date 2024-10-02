import {
  ArrowTopRightOnSquareIcon,
  ChevronUpIcon,
  DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
  KeyIcon as KeyIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  UserCircleIcon,
  UsersIcon as UsersIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  ComputerDesktopIcon as ComputerDesktopIconSolid,
  ViewfinderCircleIcon as ViewfinderCircleIconSolid,
  ArrowPathIcon as ArrowPathIconSolid,
  ArrowUpTrayIcon as ArrowUpTrayIconSolid,
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  ChartBarSquareIcon as ChartBarSquareIconSolid,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';

import {
  DevicePhoneMobileIcon as DevicePhoneMobileIconOutline,
  KeyIcon as KeyIconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
  UsersIcon as UsersIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
  ComputerDesktopIcon as ComputerDesktopIconOutline,
  ViewfinderCircleIcon as ViewfinderCircleIconOutline,
  ArrowPathIcon as ArrowPathIconOutline,
  ArrowUpTrayIcon as ArrowUpTrayIconOutline,
  ArrowsRightLeftIcon as ArrowsRightLeftIconOutline,
  ShieldCheckIcon as ShieldCheckIconOutline,
  ChartBarSquareIcon as ChartBarSquareIconOutline,
} from '@heroicons/react/24/outline';

import LogoBlock from './components/LogoBlock';
import MenuRow from './components/MenuRow';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from '@/routes';

const Sidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTenantCollapsed, setIsTenantCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      iconSolid: <Squares2X2IconSolid className="size-6" />,
      iconOutline: <Squares2X2IconOutline className="size-6" />,
      route: AppRoutes.DASHBOARD_ROUTE,
    },
    {
      title: 'Devices',
      iconSolid: <DevicePhoneMobileIconSolid className="size-6" />,
      iconOutline: <DevicePhoneMobileIconOutline className="size-6" />,
      route: AppRoutes.HOSTS_ROUTE,
    },
    {
      title: 'Users',
      iconSolid: <UsersIconSolid className="size-6" />,
      iconOutline: <UsersIconOutline className="size-6" />,
      route: AppRoutes.USERS_ROUTE,
    },
    {
      title: 'Keys',
      iconSolid: <KeyIconSolid className="size-6" />,
      iconOutline: <KeyIconOutline className="size-6" />,
      route: AppRoutes.ENROLLMENT_KEYS_ROUTE,
    },
  ];

  const networkMenuItems = [
    {
      title: 'Networks',
      iconSolid: <GlobeAltIconSolid className="size-6" />,
      iconOutline: <GlobeAltIconOutline className="size-6" />,
      route: AppRoutes.NETWORKS_ROUTE,
      rightIcon: 'ellipsis',
    },
    {
      title: 'Nodes',
      iconSolid: <ComputerDesktopIconSolid className="size-6" />,
      iconOutline: <ComputerDesktopIconOutline className="size-6" />,
      route: null,
    },
    {
      title: 'Remote Access',
      iconSolid: <ViewfinderCircleIconSolid className="size-6" />,
      iconOutline: <ViewfinderCircleIconOutline className="size-6" />,
      route: null,
    },
    {
      title: 'Relays',
      iconSolid: <ArrowPathIconSolid className="size-6" />,
      iconOutline: <ArrowPathIconOutline className="size-6" />,
      route: null,
    },
    {
      title: 'Egress',
      iconSolid: <ArrowUpTrayIconSolid className="size-6" />,
      iconOutline: <ArrowUpTrayIconOutline className="size-6" />,
      route: null,
    },
    {
      title: 'Gateways',
      iconSolid: <ArrowsRightLeftIconSolid className="size-6" />,
      iconOutline: <ArrowsRightLeftIconOutline className="size-6" />,
      route: null,
    },
    {
      title: 'Access Control',
      iconSolid: <ShieldCheckIconSolid className="size-6" />,
      iconOutline: <ShieldCheckIconOutline className="size-6" />,
      route: null,
    },
    {
      title: 'Analytics',
      iconSolid: <ChartBarSquareIconSolid className="size-6" />,
      iconOutline: <ChartBarSquareIconOutline className="size-6" />,
      route: null,
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = [...menuItems, ...networkMenuItems].find((item) => item.route === currentPath);
    if (currentMenuItem) {
      setSelectedMenu(currentMenuItem.title);
    }
  }, [location]);

  useEffect(() => {
    console.log('Selected menu:', selectedMenu);
  }, [selectedMenu]);

  const handleMenuClick = (title: string) => {
    setSelectedMenu(title);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`sticky top-0 left-0 z-10 flex flex-col justify-between h-screen pb-2 bg-bg-contrastDefault transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-56'}`}
    >
      <div>
        <LogoBlock isSidebarCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
        <div
          className="flex gap-4 py-3 pl-5 pr-4 cursor-pointer text-text-secondary hover:bg-bg-contrastHover"
          onClick={() => setIsTenantCollapsed(!isTenantCollapsed)}
        >
          <ChevronUpIcon className={`size-6 ${isTenantCollapsed ? 'transform rotate-180' : ''}`} />
          {!isSidebarCollapsed && (
            <div className="flex flex-col w-full py-0.5 gap-1 ">
              <span className="text-text-primary text-sm-semibold">Tenant</span>
              <span className="text-sm">Starter</span>
            </div>
          )}
          {!isSidebarCollapsed && <ArrowTopRightOnSquareIcon className="size-6 hover:text-text-primary" />}
        </div>
        {!isTenantCollapsed && (
          <div>
            {menuItems.map(({ title, iconSolid, iconOutline, route }) => (
              <Link to={route} key={title}>
                <MenuRow
                  title={title}
                  icon={selectedMenu === title ? iconSolid : iconOutline}
                  selected={selectedMenu === title}
                  onClick={() => handleMenuClick(title)}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4">
          {networkMenuItems.map(({ title, iconSolid, iconOutline, route, rightIcon }) =>
            route ? (
              <Link to={route} key={title}>
                <MenuRow
                  title={title}
                  icon={selectedMenu === title ? iconSolid : iconOutline}
                  selected={selectedMenu === title}
                  onClick={() => handleMenuClick(title)}
                  rightIcon={rightIcon as 'ellipsis' | 'plus' | undefined}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              </Link>
            ) : (
              <MenuRow
                key={title}
                title={title}
                icon={selectedMenu === title ? iconSolid : iconOutline}
                selected={selectedMenu === title}
                onClick={() => handleMenuClick(title)}
                rightIcon={rightIcon as 'ellipsis' | 'plus' | undefined}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            ),
          )}
        </div>
      </div>
      <MenuRow
        title="oleg@netmaker.io"
        icon={<UserCircleIcon className="size-6" />}
        rightIcon="ellipsis"
        isSidebarCollapsed={isSidebarCollapsed}
      />
    </div>
  );
};

export default Sidebar;
