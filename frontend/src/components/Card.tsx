import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', headerAction, noPadding = false }) => {
  return (
    <div className={`card ${className}`}>
      {(title || headerAction) && (
        <div className="card-header">
          <div className="header-titles">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card-action">{headerAction}</div>}
        </div>
      )}
      <div className={`card-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
      <style>{`
        .card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05);
        }
        .card-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
        }
        .card-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .card-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
          font-weight: 500;
        }
        .card-content {
          padding: 24px;
        }
        .card-content.no-padding {
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default Card;
