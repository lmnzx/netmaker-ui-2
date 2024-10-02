import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/20/solid';
import React from 'react';

type MenuRowProps = {
  title: string;
  icon: React.ReactNode;
  selected?: boolean;
  rightIcon?: 'plus' | 'ellipsis';
  isSidebarCollapsed?: boolean;
  onClick?: () => void;
};

const MenuRow: React.FC<MenuRowProps> = ({ title, icon, selected, rightIcon, isSidebarCollapsed, onClick }) => {
  return (
    <div
      className={`flex items-center w-full gap-4 px-5 py-3 cursor-pointer 
        ${selected ? 'bg-bg-default text-text-primary' : 'text-text-secondary hover:bg-bg-contrastHover hover:text-text-primary'} 
        ${isSidebarCollapsed ? 'justify-center' : ''}`}
      onClick={onClick}
    >
      {icon}
      {!isSidebarCollapsed && (
        <>
          <p className="flex-grow text-sm truncate">{title}</p>
          {rightIcon === 'plus' && (
            <div className="ml-auto">
              <PlusIcon className="size-6" />
            </div>
          )}
          {rightIcon === 'ellipsis' && (
            <div className="ml-auto">
              <EllipsisVerticalIcon className="size-6" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuRow;
