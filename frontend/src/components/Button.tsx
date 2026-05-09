import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', fullWidth = false, ...props }) => {
  return (
    <button className={`btn-premium btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
      <style>{`
        .btn-premium {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          font-family: inherit;
          white-space: nowrap;
        }

        /* VARIANTS */
        .btn-primary {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-secondary {
          background: #eff6ff;
          color: #2563eb;
        }
        .btn-secondary:hover { background: #dbeafe; }

        .btn-outline {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }
        .btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .btn-danger {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
        }
        .btn-danger:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        /* SIZES */
        .btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
        .btn-md { padding: 10px 20px; }
        .btn-lg { padding: 14px 28px; font-size: 16px; }

        .w-full { width: 100%; }

        /* DISABLED */
        .btn-premium:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(1);
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </button>
  );
};

export default Button;
