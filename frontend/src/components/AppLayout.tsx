import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  activeItem: string;
  onNavigate: (page: string) => void;
  breadcrumb?: { label: string; page?: string }[];
  children: React.ReactNode;
}

/**
 * AppLayout — Wrapper chung cho tất cả các trang trong ứng dụng (trừ LoginPage).
 * Render Sidebar + Header + breadcrumb một lần duy nhất, tránh lặp lại code.
 */
const AppLayout: React.FC<AppLayoutProps> = ({ activeItem, onNavigate, breadcrumb, children }) => {
  return (
    <div className="layout">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <div className="main-container">
        <Header onNavigate={onNavigate} />
        <main className="content">
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="breadcrumb">
              <span className="link" onClick={() => onNavigate('dashboard')}>Dashboard</span>
              {breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  <span className="material-icons-round separator">chevron_right</span>
                  {b.page ? (
                    <span className="link" onClick={() => onNavigate(b.page!)}>{b.label}</span>
                  ) : (
                    <span className="current">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
