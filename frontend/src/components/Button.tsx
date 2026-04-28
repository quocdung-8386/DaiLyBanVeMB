import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: all 0.2s;
          gap: var(--space-sm);
        }
        .btn-primary {
          background: var(--primary);
          color: white;
        }
        .btn-primary:hover {
          background: var(--primary-dark);
        }
        .btn-secondary {
          background: var(--primary-light);
          color: var(--primary);
        }
        .btn-outline {
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-main);
        }
        .btn-outline:hover {
          background: var(--bg-main);
        }
        .btn-md { padding: 10px 20px; font-size: 14px; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn-lg { padding: 14px 28px; font-size: 16px; }
      `}</style>
    </button>
  );
};

export default Button;
