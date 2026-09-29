import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { FloatingChatWidget, ChatDrawer } from '../chat';

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Header */}
      <Header isCollapsed={isCollapsed} />

      {/* Main Content */}
      <main
        className={`
          pt-16 min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'ml-[72px]' : 'ml-[260px]'}
        `}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Global AI Privacy Assistant Floating Widget & Slide-Over Drawer */}
      <FloatingChatWidget />
      <ChatDrawer />
    </div>
  );
};

export default AppLayout;
