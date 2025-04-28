import React from 'react';
import { Home, BarChart2, MessageSquare, Users, User } from 'lucide-react';

const BottomNavBar = ({ active }) => {
  const navItems = [
    { name: 'HOME', icon: Home, path: '/' },
    { name: 'RANK', icon: BarChart2, path: '/rank' },
    { name: 'DM', icon: MessageSquare, path: '/dm' },
    { name: 'SOCIAL', icon: Users, path: '/social' },
    { name: 'LOGIN', icon: User, path: '/login' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] h-16 bg-white flex justify-between items-center px-2 border-t border-gray-100">
      {navItems.map((item) => (
        <a 
          key={item.name}
          href={item.path}
          className={`flex flex-col items-center justify-center w-16 h-full ${
            active === item.name.toLowerCase() ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <item.icon size={20} />
          <span className="text-xs mt-1">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export default BottomNavBar;